# Protocolo de comunicación Cliente-Servidor de Scopper

> **Nota:** este protocolo está basado en el modelo Entidad-Relación y el diagrama de clases de la Entrega 1. A partir de esto, podría recibir ajustes debidamente justificados en las entregas futuras una vez que se realice la integración con el backend

## 1. Objetos base

Estas son las estructuras que se repiten dentro de las distintas respuestas del servidor

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
  "dueño_id": 12,
  "es_mina_oro": false,
  "unidad_id": 14
}
```

- `dueño_id: null` = casilla neutral
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
  "orden_turno": 2
}
```

- Es público, pero no muestra datos privados. El oro y el inventario de mejoras son información privada de cada jugador, a partir de esto, el objeto del rival nunca incluye estos campos

## 2. Objeto estado del juego

Es lo que devuelve `consultar_estado`. Las acciones que modifican la partida devuelven una respuesta parcial con los datos afectados. Después de cualquier acción, el cliente puede usar `consultar_estado` para obtener este objeto completo

```json
{
  "partida_id": 4,
  "estado": "en_progreso",
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "tablero": [ /* 64 objetos Casilla */ ],
  "unidades": [ /* objetos Unidad de ambos jugadores */ ],
  "mejoras": [ /* objetos de tipo Mejora */ ],
  "mi_estado": { "jugador_id": 12, "oro": 8, "orden_turno": 1, "inventario_mejoras": [23, 24] },
  "estado_oponente": { "jugador_id": 18, "orden_turno": 2 },
  "cronica": [
    { "turno": 7, "descripcion": "Lyria conquistó una casilla neutral" },
    { "turno": 8, "descripcion": "Arkan recibió 3 de oro por territorio" }
  ]
}
```

- `estado` puede ser `"en_espera"`, `"en_progreso"` o `"finalizada"`

- `tablero` se representa como un array de 64 casillas, cada una con sus propias `x`/`y`. `unidades` es un array aparte, lo cual coincide con el modelo ER de la Entrega 1, donde `casillas` y `unidades` son tablas separadas

- `mejoras` se representa como un array con las mejoras equipadas de ambos jugadores y las mejoras sin equipar del jugador que hace la consulta. Las mejoras equipadas en una unidad son visibles para ambos jugadores, porque la unidad misma es pública dado que está en el tablero. Las mejoras sin equipar (`unidad_id: null`) son privadas y nunca se incluyen desde el inventario del rival

- `cronica` es el historial de acciones de la partida. Este se agregó a partir del feedback recibido sobre la Entrega 1, que señalaba la falta de un registro de acciones en el modelo de datos

## 3. Requests y responses por acción

### Registro de usuario

**Request**

```json
{
  "accion": "registro",
  "nombre_usuario": "Arkan",
  "correo": "arkan@reino.cl",
  "contrasena": "********",
  "avatar": null,
  "rol": "Jugador"
}
```

- `rol` puede ser `"Jugador"` o `"Administrador"`. En este protocolo, las acciones de partida corresponden al rol `Jugador`, a partir de esto, las funciones administrativas no forman parte de esta entrega y se definirán en un protocolo posterior

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

**Request**

```json
{
  "accion": "login",
  "correo": "arkan@reino.cl",
  "contrasena": "********"
}
```

**Response - éxito (200)**

```json
{
  "usuario_id": 12,
  "nombre_usuario": "Arkan"
}
```

**Response - error (401)**

```json
{ "error": "credenciales_invalidas" }
```

### Crear partida

**Request**

```json
{
  "jugador_id": 12,
  "accion": "crear_partida",
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

**Request**

```json
{
  "jugador_id": 18,
  "partida_id": 4,
  "accion": "unirse_partida"
}
```

**Response - éxito (200)**

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

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "mover_atacar",
  "unidad_id": 13,
  "casilla_destino": { "x": 3, "y": 5 }
}
```

- En este ejemplo, el jugador `12` intenta mover su unidad `13` hacia la casilla de destino. Si la casilla está ocupada por una unidad rival, se produce un combate. `unidad_perdida_id` identifica a la unidad derrotada y puede corresponder a la unidad atacante o defensora, en este caso, la unidad derrotada es la unidad rival `14`

**Response - éxito, con combate (200)**

```json
{
  "partida_id": 4,
  "turno_actual": 8,
  "jugador_en_turno": 18,
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
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "resultado_combate": { "hubo_combate": false }
}
```

### Reclutar

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "reclutar",
  "casilla_destino": { "x": 2, "y": 6 },
  "tipo_unidad": "arquero"
}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
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

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "equipar_mejora",
  "unidad_id": 14,
  "mejora_id": 21
}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "turno_actual": 8,
  "jugador_en_turno": 18,
  "unidad_actualizada": { "unidad_id": 14, "mejoras_equipadas": [21, 22] }
}
```

**Response - error (422)**

```json
{ "error": "limite_mejoras_equipadas" }
```

### Comprar mejora

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "comprar_mejora",
  "tipo_mejora": "espada_acero"
}
```

**Response - éxito (200)**

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

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "pasar_turno"
}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "turno_actual": 9,
  "jugador_en_turno": 18
}
```

### Rendirse

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "rendirse",
  "confirmado": true
}
```

**Response - éxito (200)**

```json
{
  "partida_id": 4,
  "estado": "finalizada",
  "ganador_id": 18
}
```

### Consultar estado

**Request**

```json
{
  "jugador_id": 12,
  "partida_id": 4,
  "accion": "consultar_estado"
}
```

**Response** - devuelve el objeto estado del juego completo mostrado anteriormente

## 4. Casos borde y errores comunes

| Código | `error` | Cuándo ocurre |
|---|---|---|
| 403 | `fuera_de_turno` | El jugador intenta enviar una acción cuando no es su turno |
| 409 | `correo_ya_registrado` | El correo ya existe en el sistema al registrarse |
| 409 | `nombre_usuario_ya_registrado` | El nombre de usuario ya existe al registrarse |
| 401 | `credenciales_invalidas` | Correo o contraseña incorrectos al iniciar sesión |
| 409 | `jugador_ya_tiene_partida_activa` | El jugador intenta crear o unirse a una partida teniendo otra en espera o en progreso |
| 409 | `partida_llena` | El jugador intenta unirse a una partida que ya tiene dos jugadores |
| 422 | `reclutamiento_invalido` | Casilla ocupada, casilla ajena/neutral u oro insuficiente al reclutar |
| 422 | `limite_mejoras_equipadas` | Se intenta equipar una sexta mejora a una unidad |
| 422 | `oro_insuficiente` | No hay oro suficiente para comprar una mejora |

## 5. Decisiones de diseño registradas

- **Coordenadas del tablero:** el origen `{ "x": 0, "y": 0 }` se encuentra en la esquina superior izquierda. `x` aumenta hacia la derecha e `y` aumenta hacia abajo, además, ambas coordenadas usan valores entre `0` y `7`. La fila de despliegue del jugador 1 es `y = 1` y su fila trasera disponible para reclutar es `y = 0`. El jugador 2 se despliega en `y = 6` y tiene su fila trasera en `y = 7`

- **Compra de mejoras:** no consume el turno del jugador y permite múltiples compras en un mismo turno

- **Despliegue inicial:** cada jugador comienza con una sola fila de unidades desplegadas, la fila trasera queda vacía como territorio propio, disponible para reclutar desde el inicio

- **Privacidad del oro:** el oro de cada jugador es privado. El objeto `estado_rival` nunca incluye el campo `oro` ni `inventario_mejoras`

- **Unidades:** se representan en un array aparte del tablero, correspondiente a lo diseñado en el modelo ER de la Entrega 1

- **Victoria:** un jugador gana al controlar al menos el 60% de las 64 casillas del tablero, es decir, 39 casillas. También gana si el rival se rinde

- **Mago:** cada acción o evento que pueda generar oro adicional debe aplicar una probabilidad del 20%. La cantidad de oro entregada debe quedar definida antes de implementar el backend