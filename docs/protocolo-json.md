# Protocolo de comunicación Cliente-Servidor de Scopper

> **Nota:** este protocolo está basado en el modelo Entidad-Relación y el diagrama de clases de la Entrega 1. Se actualiza para reflejar la integración implementada en las Entregas 3 y 4, manteniendo las estructuras originales del juego y documentando los cambios de autenticación, reglas y comunicación en tiempo real.

## 1. Objetos base

Estas son las estructuras que se repiten dentro de las distintas respuestas del servidor. Los ejemplos usan identificadores ilustrativos.

### Unidad

```json
{
  "unidad_id": 14,
  "jugador_id": 12,
  "tipo": "arquero",
  "casilla": { "x": 2, "y": 5 },
  "ataque_base": 3,
  "defensa_base": 2,
  "mejoras_equipadas": [21, 22]
}
```

- `ataque_base`/`defensa_base` son los valores fijos de la unidad. El bono de tipo solo se calcula en el momento de un combate puntual, es decir, no es un valor fijo de la unidad en su estado base

### Mejora

```json
{
  "mejora_id": 21,
  "tipo": "espada_acero",
  "bono": 1,
  "unidad_id": 14
}
```

- `unidad_id: null` significa que la mejora está en el inventario del jugador, es decir, sin equipar

### Casilla

```json
{
  "x": 2,
  "y": 5,
  "dueno_id": 12,
  "es_mina_oro": false,
  "unidad_id": 14
}
```

- `dueno_id: null` = casilla neutral
- `unidad_id: null` = casilla vacía

### Mi estado

```json
{
  "jugador_id": 12,
  "oro": 8,
  "orden_turno": 1,
  "inventario_mejoras": [23, 24]
}
```

- Es privado, por ende, solo se envía al dueño de la sesión

### Estado del rival

```json
{
  "jugador_id": 18,
  "nombre_usuario": "Lyria",
  "orden_turno": 2
}
```

- Es público, pero no muestra datos privados. El oro y el inventario de mejoras son información privada de cada jugador, a partir de esto, el objeto del rival nunca incluye estos campos

## 2. Objeto estado del juego

Es lo que devuelve `GET /api/partidas/:partida_id/estado` (`consultar_estado`). Las acciones que modifican la partida devuelven una respuesta parcial con los datos afectados. Después de cualquier acción, el cliente puede usar esta ruta para obtener el objeto completo, siempre que sea uno de los participantes.

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "ganador_id": null,
  "tablero": [ /* 64 objetos Casilla */ ],
  "unidades": [ /* objetos Unidad de ambos jugadores */ ],
  "mejoras": [ /* objetos de tipo Mejora */ ],
  "mi_estado": { "jugador_id": 12, "oro": 8, "orden_turno": 1, "inventario_mejoras": [23, 24] },
  "estado_oponente": { "jugador_id": 18, "nombre_usuario": "Lyria", "orden_turno": 2 },
  "cronica": [
    { "turno": 7, "descripcion": "Lyria conquistó una casilla neutral" },
    { "turno": 8, "descripcion": "Arkan recibió 3 de oro por territorio" }
  ]
}
```

- `estado` puede ser `"en_espera"`, `"en_progreso"` o `"finalizada"`. Cuando una partida finaliza, `jugador_en_turno` queda en `null`; `ganador_id` identifica al ganador o queda en `null` si hubo empate. Mientras la partida está activa, `ganador_id` es `null`.

- `tablero` se representa como un array de 64 casillas, cada una con sus propias `x`/`y`. `unidades` es un array aparte, lo cual coincide con el modelo ER de la Entrega 1, donde `casillas` y `unidades` son tablas separadas

- `mejoras` se representa como un array con las mejoras equipadas de ambos jugadores y las mejoras sin equipar del jugador que hace la consulta. Las mejoras equipadas en una unidad son visibles para ambos jugadores, porque la unidad misma es pública dado que está en el tablero. Las mejoras sin equipar (`unidad_id: null`) son privadas y nunca se incluyen desde el inventario del rival

- `cronica` es el historial de acciones de la partida. Este se agregó a partir del feedback recibido sobre la Entrega 1, que señalaba la falta de un registro de acciones en el modelo de datos. En E4 también registra eventos aleatorios y el motivo del cierre de la partida. El estado incluye los eventos recientes; el historial completo se obtiene con `GET /api/partidas/:partida_id/cronica`. La crónica es visible para los participantes, sin revelar el oro o el inventario privado del rival ni qué mejora se compró.

- El servidor devuelve este estado según el JWT del solicitante, por lo que `mi_estado` siempre es el del usuario autenticado y el inventario sin equipar del rival no se incluye. El estado de una partida en curso o finalizada es privado para sus participantes; una consulta ajena responde `403`.

## 3. Requests y responses por acción

Las rutas siguientes pertenecen a la API REST de Koa y comienzan con `/api` (`http://localhost:3000/api` en local o `https://scopper-backend.onrender.com/api` en producción). Las solicitudes y respuestas usan JSON. Salvo registro, inicio de sesión y `GET /api/disponible`, se debe enviar `Authorization: Bearer <token>` con el JWT obtenido en el login. El servidor verifica la firma, el vencimiento y los permisos; obtiene el solicitante desde `ctx.state.user.usuario_id`, por lo que **ya no se envían `jugador_id` ni `solicitante_id` en el body ni en la query para identificar al actor**. Los identificadores de recursos (`:partida_id`, `:unidad_id`, `:mejora_id`, `:jugador_id`) sí permanecen en la ruta. Los ejemplos de respuestas son ilustrativos.

El backend conserva los códigos HTTP semánticos: `400` para solicitudes mal formadas, `401` sin autenticación válida, `403` sin permisos, `404` para recursos inexistentes, `409` para conflictos y `422` para acciones que incumplen reglas. Las respuestas de error incluyen `error` y `mensaje`, y pueden agregar `detalle`, `campos` o `partida_id` cuando corresponda. En los ejemplos de error abreviados se omite `mensaje` para mantener el formato original del protocolo. La información privada no debe almacenarse en caché (`Cache-Control: no-store`).

### Registro de usuario

- **Ruta:** `POST /api/usuarios` (pública). El rol inicial es `Jugador`, salvo que se solicite `Administrador` con `codigo_admin` válido en el registro.
- El backend guarda las contraseñas hasheadas con `bcrypt` (12 rondas); nunca las almacena ni devuelve en texto plano. La contraseña debe tener entre 6 caracteres y 72 bytes UTF-8, el nombre de usuario de 3 a 50 caracteres alfanuméricos o `_`, y el correo se normaliza a minúsculas (máximo 200 caracteres).

**Request**

```json
{
  "nombre_usuario": "Arkan",
  "correo": "arkan@reino.cl",
  "contrasena": "********",
  "avatar": null,
  "rol": "Jugador"
}
```

- `rol` puede ser `"Jugador"` o `"Administrador"`. Ambos pueden jugar sujetos a las mismas reglas y permisos de participación. Para registrar un administrador debe añadirse `"codigo_admin": "CODIGO_DE_EJEMPLO"` al request; el servidor lo compara con `CODIGO_ADMIN` del entorno. En E4 se incorpora como esqueleto administrativo la ruta `GET /api/admin/resumen`, exclusiva de administradores.

**Response - éxito (201)**

```json
{
  "usuario_id": 12,
  "nombre_usuario": "Arkan",
  "correo": "arkan@reino.cl",
  "rol": "Jugador"
}
```

**Response - error (409)**

```json
{ "error": "correo_ya_registrado" }
```

```json
{ "error": "nombre_usuario_ya_registrado" }
```

### Inicio de sesión

- **Ruta:** `POST /api/auth/login` (pública). La contraseña se compara mediante `bcrypt.compare`. Las credenciales inválidas devuelven `401`.

**Request**

```json
{
  "correo": "arkan@reino.cl",
  "contrasena": "********"
}
```

**Response - éxito (200)**

```json
{
  "usuario_id": 12,
  "nombre_usuario": "Arkan",
  "rol": "Jugador",
  "token": "TOKEN_JWT_ILUSTRATIVO"
}
```

El JWT está firmado con `HS256`, incluye `usuario_id` y `rol`, y tiene una vigencia de dos horas. El frontend conserva el token en la sesión y lo envía en la cabecera `Authorization`, nunca como parámetro de URL.

**Response - error (401)**

```json
{ "error": "credenciales_invalidas" }
```

### Crear partida

- **Ruta:** `POST /api/partidas` (Bearer). El creador se obtiene del JWT; no se envía su ID en el cuerpo de la solicitud.

**Request**

```json
{
  "nombre_partida": "La última frontera"
}
```

**Response - éxito (201)**

```json
{
  "partida_id": 4,
  "estado": "en_espera",
  "creador_id": 12
}
```

**Response - error (409)**

```json
{ "error": "jugador_ya_tiene_partida_activa", "partida_id": 2 }
```

### Unirse a partida

- **Ruta:** `POST /api/partidas/4/jugadores` (Bearer). El ID de la partida se indica en la URL y el segundo jugador se identifica con su JWT. El cuerpo no necesita campos.

**Request**

```json
{}
```

**Response - éxito (201)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 1,
  "jugador_en_turno": 12
}
```

**Response - error (409)**

```json
{ "error": "partida_llena" }
```

```json
{ "error": "jugador_ya_tiene_partida_activa", "partida_id": 2 }
```

### Mover/Atacar

- **Ruta:** `PATCH /api/partidas/4/unidades/13` (Bearer). El ID de la unidad va en la URL; el usuario que intenta moverla se obtiene del JWT. Una jugada inválida, fuera de turno o en una partida terminada se rechaza y no modifica el estado.

**Request**

```json
{
  "casilla_destino": { "x": 3, "y": 5 }
}
```

- En este ejemplo, el jugador `12` intenta mover su unidad `13` hacia la casilla de destino. Si la casilla está ocupada por una unidad rival, se produce un combate. `unidad_perdida_id` identifica a la unidad derrotada y puede corresponder a la unidad atacante o defensora, en este caso, la unidad derrotada es la unidad rival `14`

**Response - éxito, con combate (200)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "ganador_id": null,
  "resultado_combate": {
    "hubo_combate": true,
    "ganador_id": 12,
    "unidad_perdida_id": 14
  },
  "mi_estado": { "jugador_id": 12, "oro": 6, "orden_turno": 1, "inventario_mejoras": [23] }
}
```

**Response - éxito, conquista de casilla neutral o reposicionamiento (200)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "ganador_id": null,
  "resultado_combate": { "hubo_combate": false }
}
```

### Reclutar

- **Ruta:** `POST /api/partidas/4/unidades` (Bearer). Reclutar cuesta 5 de oro y consume el turno; el servidor valida el tipo de unidad, la casilla y el oro disponible.

**Request**

```json
{
  "casilla_destino": { "x": 2, "y": 6 },
  "tipo_unidad": "arquero"
}
```

**Response - éxito (201)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "ganador_id": null,
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "unidad_creada": { "unidad_id": 30, "tipo": "arquero", "casilla": { "x": 2, "y": 6 } },
  "mi_estado": { "jugador_id": 12, "oro": 3, "orden_turno": 1, "inventario_mejoras": [23] }
}
```

**Response - error (422)**

```json
{ "error": "reclutamiento_invalido", "detalle": "casilla_ocupada" }
```

```json
{ "error": "reclutamiento_invalido", "detalle": "oro_insuficiente" }
```

### Equipar mejora

- **Ruta:** `PUT /api/partidas/4/unidades/14/mejoras/21` (Bearer). Tanto la unidad como la mejora se identifican en la URL; el cuerpo es vacío. La unidad y la mejora deben pertenecer al jugador y la unidad no puede superar cinco mejoras equipadas. Equipar consume el turno.

**Request**

```json
{}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "ganador_id": null,
  "unidad_actualizada": { "unidad_id": 14, "mejoras_equipadas": [21, 22] }
}
```

**Response - error (422)**

```json
{ "error": "limite_mejoras_equipadas" }
```

### Comprar mejora

- **Ruta:** `POST /api/partidas/4/mejoras` (Bearer). El jugador se identifica por el JWT. Se verifica que la mejora exista en el catálogo y que tenga oro suficiente (cada mejora cuesta 3 de oro).

**Request**

```json
{
  "tipo_mejora": "espada_acero"
}
```

**Response - éxito (201)**

- Esta acción no consume el turno, esto significa que la respuesta no modifica `turno_actual` ni `jugador_en_turno`, y el jugador puede comprar más de una mejora antes de realizar la acción principal de su turno

```json
{
  "partida_id": 4,
  "mejora_creada": { "mejora_id": 25, "tipo": "espada_acero", "bono": 1, "unidad_id": null },
  "oro_restante": 5
}
```

**Response - error (422)**

```json
{ "error": "oro_insuficiente" }
```

### Pasar turno

- **Ruta:** `PATCH /api/partidas/4/turno` (Bearer), con cuerpo vacío. Solo el participante que tiene el turno puede hacerlo. El servidor responde `422 fuera_de_turno` si intenta pasar otro jugador.

**Request**

```json
{}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 9,
  "jugador_en_turno": 18,
  "ganador_id": null
}
```

### Rendirse

- **Ruta:** `POST /api/partidas/4/rendicion` (Bearer). Un participante puede rendirse aunque no sea su turno. La confirmación debe ser `true`; al rendirse, el backend finaliza la partida sin sortear eventos ni cambiar el turno.

**Request**

```json
{
  "confirmado": true
}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "estado": "finalizada",
  "turno_actual": 8,
  "jugador_en_turno": null,
  "ganador_id": 18
}
```

### Consultar estado

- **Ruta:** `GET /api/partidas/4/estado` (Bearer). Solo puede consultarla un participante; la identidad no se envía como parámetro. La respuesta contiene `ganador_id` y los campos privados del solicitante, sin exponer los recursos privados del rival.

**Request**

No requiere body; basta con enviar la ruta y el token en la cabecera `Authorization`.

**Response** - devuelve el objeto estado del juego completo mostrado anteriormente. Al finalizar, `estado` es `"finalizada"`, `jugador_en_turno` es `null` y `ganador_id` identifica al ganador o es `null` en un empate.

**Otras consultas y operaciones REST de E4**

Para conservar los objetos de este protocolo, las rutas de consulta adicionales utilizan las mismas representaciones de usuario, casilla, unidad y mejora. Todas, salvo registro y login, requieren Bearer.

| Método y ruta (prefijo `/api`) | Respuesta o condición principal |
|---|---|
| `GET /partidas` | Lista resumida; admite `?estado=en_espera`, `en_progreso` o `finalizada` |
| `GET /partidas/:partida_id` | Detalle de la partida; una partida en progreso o finalizada solo es consultable por participantes |
| `DELETE /partidas/:partida_id` | Cancela una partida en espera por su creador o la elimina un administrador; devuelve `{ "partida_id": 4, "eliminado": true }` |
| `GET /partidas/:partida_id/jugadores/:jugador_id` | Consulta el oro, orden de turno e inventario del jugador objetivo, solo si coincide con el titular autenticado |
| `GET /partidas/:partida_id/casillas` y `GET /partidas/:partida_id/casillas/:x/:y` | Casillas de una partida para sus participantes |
| `GET /partidas/:partida_id/unidades` y `GET /partidas/:partida_id/unidades/:unidad_id` | Unidades de una partida para sus participantes |
| `GET /partidas/:partida_id/mejoras` | Mejoras equipadas y mejoras del inventario propio; sin query `jugador_id` |
| `GET /partidas/:partida_id/cronica` | Historial de acciones, eventos y cierre |
| `GET /tipos-mejora` | Catálogo de mejoras disponibles |
| `GET /usuarios` | Lista de usuarios, solo administrador |
| `GET /usuarios/:usuario_id` | Perfil del titular o de un administrador |
| `PATCH /usuarios/:usuario_id` | Actualiza nombre, correo, contraseña o avatar del titular; no modifica el rol |
| `DELETE /usuarios/:usuario_id` | Elimina al titular o a un administrador autorizado, si no hay partidas asociadas |
| `GET /admin/resumen` | Solo administrador; devuelve un conteo real, por ejemplo `{ "partidas_activas": 3 }` |

Las rutas que antes permitían modificar directamente el oro, las casillas o eliminar una unidad (`PATCH /partidas/:partida_id/jugadores/:jugador_id`, `PATCH /partidas/:partida_id/casillas/:x/:y` y `DELETE /partidas/:partida_id/unidades/:unidad_id`) fueron retiradas en E4. Los recursos solo cambian mediante acciones validadas por el backend.

## 4. Casos borde y errores comunes

| Código | `error` | Cuándo ocurre |
|---|---|---|
| 422 | `fuera_de_turno` | El jugador intenta enviar una acción cuando no es su turno |
| 409 | `correo_ya_registrado` | El correo ya existe en el sistema al registrarse |
| 409 | `nombre_usuario_ya_registrado` | El nombre de usuario ya existe al registrarse |
| 401 | `credenciales_invalidas` | Correo o contraseña incorrectos al iniciar sesión |
| 409 | `jugador_ya_tiene_partida_activa` | El jugador intenta crear o unirse a una partida teniendo otra en espera o en progreso |
| 409 | `partida_llena` | El jugador intenta unirse a una partida que ya tiene dos jugadores |
| 422 | `reclutamiento_invalido` | Casilla ocupada, casilla ajena/neutral u oro insuficiente al reclutar |
| 422 | `limite_mejoras_equipadas` | Se intenta equipar una sexta mejora a una unidad |
| 422 | `oro_insuficiente` | No hay oro suficiente para comprar una mejora |
| 400 | `solicitud_invalida` | El cliente envía `jugador_id` o `solicitante_id` como identidad del actor, o utiliza un cuerpo inválido |
| 400 | `coordenadas_invalidas` | Se consultan coordenadas fuera del rango de 0 a 7 |
| 401 | `token_requerido` o `token_invalido` | Falta el token Bearer, es inválido, venció o no corresponde al usuario actual |
| 403 | `sin_permiso`, `jugador_no_pertenece_a_partida` o `recurso_privado` | El usuario intenta consultar o modificar datos que no le corresponden |
| 403 | `codigo_admin_invalido` | Se intenta crear una cuenta de administrador con un código incorrecto |
| 404 | `partida_no_encontrada` | La partida solicitada no existe |
| 404 | `usuario_no_encontrado`, `unidad_no_encontrada`, `mejora_no_encontrada`, `casilla_no_encontrada`, `jugador_no_encontrado` o `ruta_no_encontrada` | No existe el recurso o la ruta solicitada |
| 409 | `partida_no_esta_en_espera`, `usuario_tiene_partidas`, `unidad_sin_casilla`, `recurso_en_uso` o `registro_duplicado` | Se intenta modificar o eliminar un recurso en un estado incompatible o con referencias relacionadas |
| 422 | `partida_no_en_progreso` | Se intenta jugar en una partida que está en espera o ya finalizó |
| 422 | `movimiento_invalido` o `equipamiento_invalido` | El movimiento o el equipamiento no cumple las reglas |
| 500 | `error_interno` | Fallo inesperado del servidor; no se exponen detalles internos |

## 5. Decisiones de diseño registradas

- **Coordenadas del tablero:** el origen `{ "x": 0, "y": 0 }` se encuentra en la esquina superior izquierda. `x` aumenta hacia la derecha e `y` aumenta hacia abajo, además, ambas coordenadas usan valores entre `0` y `7`. La fila de despliegue del jugador 1 es `y = 1` y su fila trasera disponible para reclutar es `y = 0`. El jugador 2 se despliega en `y = 6` y tiene su fila trasera en `y = 7`

- **Compra de mejoras:** no consume el turno del jugador y permite múltiples compras en un mismo turno

- **Despliegue inicial:** cada jugador comienza con una sola fila de unidades desplegadas, la fila trasera queda vacía como territorio propio, disponible para reclutar desde el inicio

- **Privacidad del oro:** el oro de cada jugador es privado. El objeto `estado_oponente` nunca incluye el campo `oro` ni `inventario_mejoras`

- **Unidades:** se representan en un array aparte del tablero, correspondiente a lo diseñado en el modelo ER de la Entrega 1

- **Oro:** cada jugador comienza con 5 unidades. Al entrar en su turno, recibe 1 por cada casilla propia y 2 adicionales por cada mina de oro propia. Reclutar cuesta 5 y comprar una mejora cuesta 3.

- **Movimiento y combate:** las unidades se desplazan a casillas adyacentes horizontal o verticalmente. El ataque considera las estadísticas de la unidad, las espadas y la ventaja de tipo (caballero sobre arquero, arquero sobre mago y mago sobre caballero), que otorga +2. La defensa incorpora los escudos. Si las fuerzas empatan, se lanzan dados; si persiste el empate, gana el defensor.

- **Victoria:** un jugador gana al controlar al menos el 60% de las 64 casillas del tablero, es decir, 39 casillas. También gana si el rival se queda sin territorio o se rinde. Al finalizar se guarda `estado: "finalizada"`, `jugador_en_turno: null` y `ganador_id` con el usuario ganador; si hay empate, `ganador_id: null`. El resultado queda disponible al volver a consultar la partida.

- **Mago:** al entrar un jugador en su turno, cada mago vivo puede generar una unidad adicional de oro con probabilidad del 20%, hasta un máximo de tres unidades adicionales por turno. El bono se suma al ingreso normal por territorio y minas. No depende de la cantidad de mejoras del mago.

- **Cierre por turnos:** al cerrar el turno 40, la partida termina aunque ningún jugador haya alcanzado 39 casillas. Gana quien tenga más casillas; si ambos tienen las mismas, gana quien tenga más oro. Si también empatan en oro, se declara empate (`ganador_id: null`). Este desempate se resuelve después del posible evento del turno 40 y antes de entregar un ingreso nuevo.

- **Eventos fortuitos:** cada cinco turnos cerrados (5, 10, 15, etc.) se realiza un sorteo con probabilidad del 30% de que ocurra un evento. En caso de evento, incursión y bendición tienen la misma probabilidad. La bendición suma 3 de oro a cada jugador; la incursión neutraliza entre una y dos casillas propias de cada participante, sin repetirlas, y elimina las unidades y mejoras equipadas que se encuentren allí. Después del evento se vuelve a revisar la victoria. El resultado del sorteo y sus efectos quedan registrados en PostgreSQL y en la crónica.

- **Persistencia y validación:** el servidor Koa es el árbitro de las jugadas. Verifica participación, turno, recursos y reglas, utiliza transacciones Sequelize para guardar los cambios relacionados y rechaza las acciones inválidas sin modificar el estado. Comprar mejoras no consume turno; rendirse no requiere que sea el turno propio. Los administradores pueden jugar con las mismas reglas, pero sus permisos de administración no revelan automáticamente el inventario de rivales.

- **Comunicación en tiempo real:** Socket.IO se conecta al origen del backend (`http://localhost:3000` en local o `https://scopper-backend.onrender.com` en producción), usando el transporte WebSocket y `auth: { token }` en el handshake, sin incluir el token en la URL. El servidor identifica la sesión y solo deja suscribirse a participantes de la partida. El cliente envía `partida:suscribir` con `{ "partida_id": 4 }` y recibe un acuse `{ "ok": true, "partida_id": 4 }`; si falla, el acuse incluye `ok: false`, `status`, `error` y `mensaje`. Una vez confirmada una modificación, el servidor emite `partida:actualizada` con `{ "partida_id": 4 }` a la sala de esa partida. El cliente vuelve a consultar el estado mediante HTTP autenticado, para recibir solo su información autorizada. Al reconectarse se suscribe nuevamente y actualiza los datos; al salir se desconecta y elimina los listeners. El servidor no transmite oro ni inventarios privados dentro del aviso WebSocket. Si el token falta o es inválido, `connect_error.data` puede incluir `{ status: 401, error, mensaje }`; además, el servidor desconecta el socket al vencer el token. La suscripción fallida responde con un acuse de error (por ejemplo, 400 por payload inválido, 403 por no participar o 404 por partida inexistente).

- **Seguridad de la sesión:** los tokens JWT se firman con una clave secreta definida en el entorno, no en el repositorio. Las contraseñas de los usuarios se protegen con bcrypt y no se incluyen en las respuestas. Un `401` invalida la sesión; un `403` indica que se autenticó al usuario pero no tiene permiso para ese recurso.