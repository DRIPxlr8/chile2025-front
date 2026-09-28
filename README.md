# Scopper — Crónicas del Reino

**IIC2513 - Tecnologías y Aplicaciones Web**

**Entrega 2 — Frontend**

| Nombre | Carrera |
|---|---|
| Maximiliano Santibáñez | Ingeniería Civil Industrial UC |
| Vicente San Juan | Ingeniería Civil Industrial UC |
| Tomás Vergara | Ingeniería Civil Industrial UC |


## Instalación y ejecución

1. Clonar el repositorio:
   ```
   git clone https://github.com/IIC2513/Chile2015-Frontend-S2-26-2.git
   cd Chile2015-Frontend-S2-26-2
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Levantar el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Abrir la URL que muestra la terminal (por defecto `http://localhost:5173/`).

**Versión desplegada:** https://chile2025-front.vercel.app

**Repositorio utilizado para el despliegue**: https://github.com/DRIPxlr8/chile2025-front

## Decisiones técnicas 

### (Tablero, Panel, Acciones, Crónica)
- El estado de la casilla seleccionada está en `Tablero.jsx` y se pasa hacia abajo con
 (`seleccion`/`onSeleccionar`) a `Casillas` y luego a `Casilla`, en vez de que
  cada casilla maneje su propia selección.
- El color de una casilla (propia/enemiga) se calcula comparando `dueño_id` contra
  `mockPartida.mi_estado.jugador_id`, no contra un número de jugador fijo, para que sea
  correcto sin importar cuál jugador esté viendo la partida.
- `Acciones` mantiene su propio estado de botón seleccionado, independiente del estado
  de selección de casilla en `Tablero`, ya que no necesitan comunicarse entre sí.
- Al presionar cualquier botón de acción, el turno actual avanza en 1. Por simplicidad
  para esta entrega, no se alterna el jugador en turno ni se valida de quién es el turno.

### Rutas protegidas

- `RutaProtegida.jsx` se basa en el ejemplo de rutas protegidas de [https://www.amaza-ing.com/academy/React/Temas/React-20-Rutas-Protegidas](https://www.amaza-ing.com/academy/React/Temas/React-20-Rutas-Protegidas). Se adaptó al proyecto, cambiando el nombre y la prop a español (`usuarioActivo`), agregando comentarios explicativos y utilizando `replace` en `<Navigate>`.
- Se usa para evitar que un usuario sin sesión iniciada pueda entrar a la vista de juego, ya que jugar requiere una cuenta. Si no hay una sesión activa, se redirige a `/login`.
- `replace` reemplaza la entrada actual del historial en vez de agregar una nueva. Así, al volver atrás desde `/login`, el usuario no cae nuevamente en la ruta protegida.

## Uso de Inteligencia Artificial

### Caso de uso maxsantibanez448

[Link a la conversación](https://claude.ai/share/00ab7fc0-0e04-4a69-aea9-55ce005a2729)

#### Alcance y contexto

Se utilizó Claude Sonnet 5 (esfuerzo de razonamiento: medio),
con instrucciones explícitas de corregir directamente el código sin hacer preguntas
previas, para la revisión y corrección de versiones intermedias de `Casilla.jsx`,
`Casillas.jsx`, `Tablero.jsx`, `Panel.jsx` y `Cronica.jsx`. Las versiones de código
revisadas en esa conversación corresponden a etapas intermedias del desarrollo donde el
estado final del código en este repositorio incorpora ajustes posteriores no cubiertos
por esos prompts.

#### Prompts y ajustes del estudiante sobre la salida entregada

**Prompt 1 (Casilla):**
> "Estoy trabajando en el proyecto web del juego Scopper, un juego de conquista
> territorial por turnos. La regla importante para esta función es que dueño_id y
> unidad_id son conceptos independientes: una casilla puede pertenecer a un jugador y
> no tener ninguna unidad, porque cuando una unidad se mueve, la casilla de origen
> mantiene su dueño pero queda vacía. Esto está definido explícitamente en las reglas
> del juego. Necesito que revises y corrijas directamente mi función Casilla. No quiero
> que solo señales los errores ni que me hagas preguntas: entrega la función corregida
> y explica brevemente qué corregiste. [...] Corrige la función respetando la lógica
> del juego y manteniendo independientes las condiciones de dueño id y unidad id"

Ajustes del estudiante sobre la salida: *"Se agregaron puntos y comas y comentarios
para explicar el código, se cambió la clase "unidad-" + unidad_id por la clase general
"unidad", se mantuvo la llamada original onClick={alHacerClick} en lugar de agregar una
función con las coordenadas, y se simplificó la representación de la unidad, mostrando
directamente su unidad_id sin las clases adicionales propuestas por el chat. También se
agregó export default Casilla."*

**Prompt 2 (Casillas):**
> "Revisa y corrige mi función Casillas del proyecto Usa mockPartida.tablero para
> recorrer las casillas y genera su id a partir de x e y. La función debe utilizar
> correctamente el componente Casilla, onSeleccionar, manteniendo el import consistente
> con export default. Corrige directamente los errores sin agregar funcionalidades
> innecesarias y explica brevemente los cambios."

Ajustes del estudiante sobre la salida: *"La versión final mantiene la misma lógica y
estructura de la salida entregada. Se agregó un comentario para explicar que cada
casilla se identifica mediante sus coordenadas y se extrajeron sus datos, y se ajustó
el formato del código, incluyendo la eliminación de algunos puntos y comas y cambios en
la indentación. Se corrige la importación de mockPartida sin llaves."*

**Prompt 3 (Tablero):**
> "Revisa y mejora esta función manteniendo su estructura y funcionamiento actual. La
> selección se maneja mediante useState y se entrega a Casillas mediante seleccion y
> onSeleccionar, mientras Panel, Acciones y Cronica deben mantenerse como componentes
> independientes. Ordena el JSX y corrige posibles detalles del código sin agregar
> funcionalidades nuevas ni modificar innecesariamente la lógica. Entrega la versión
> mejorada y explica brevemente los cambios realizados."

Ajustes del estudiante sobre la salida: *"Se acepta la sugerencia de crear un estilo
para contener el tablero, pero se cambia la etiqueta de \<div> por \<section> de forma
más precisa para diferenciar cada parte del tablero."*

**Prompt 4 (Panel):**
> "Revisa y mejora esta función manteniendo la lógica actual y la información que
> muestra. Debe seguir utilizando los datos de mockPartida para mostrar el estado del
> jugador, su oro, las mejoras de su inventario, el turno actual y el jugador en turno.
> Corrige posibles errores en el manejo y recorrido de inventario_mejoras, evitando
> repeticiones innecesarias y manteniendo una estructura simple. Entrega una versión
> mejorada de la función y explica brevemente los cambios realizados."

Ajustes del estudiante sobre la salida: *"Se corrige import sin llaves, así como
mantener mejora? para verificar existencia y no hayan problemas si está indefinida.
Se cambian \<div> por \<section> para el panel de turnos y el panel de estado de
partida."*

**Prompt 5 (Panel — estadísticas):**
> "Corrige esta sección del Panel para mostrar la cantidad de unidades que posee el
> jugador, también la cantidad de casillas de 64 que posee y la cantidad de mejoras
> en inventario, todo está dentro de un grid que será simétrico de 4x4"

Ajustes del estudiante sobre la salida: *"Se calculó misUnidades filtrando
mockPartida.unidades y miTerritorio desde mockPartida.tablero. Se eliminó la doble
etiqueta \<section className="cuadro"> para que el contenedor de "Estado" no tenga
doble marco."*

**Prompt 6 (Cronica):**
> "Revisa por qué la crónica no se está visualizando correctamente, la estructura de
> datos es una lista con arreglos en su interior, donde las keys son el turno y la
> descripción y los values son el número del turno y el texto de la descripción"

Ajustes del estudiante sobre la salida: *"Se agregó a la salida el valor de turno
antes de {evento.turno} así como quitar las llaves de la importación de mockPartida."*

#### Aporte y análisis

En cada uno de los 6 casos, se revisó la salida entregada por la IA y realizaron
ajustes propios antes de incorporarla, desde correcciones de formato hasta decisiones
de diseño como el uso de `<section>` en vez de `<div>`, la eliminación de estructuras
redundantes, y el cálculo de estadísticas derivadas (`misUnidades`, `miTerritorio`) que
no estaban en la solicitud original. El código resultante de esa conversación
corresponde a versiones intermedias del proyecto; a partir de ahí, se continuó ajustando
cada componente (color de casilla según dueño relativo al jugador propio, estructura
final del panel en cuadros estadísticos, y la extensión de `Acciones` para conectar la
selección de un botón con el avance del turno) hasta llegar al estado final presente en
este repositorio.



### Caso de uso tomasvergara25

[Link a la conversación](https://chatgpt.com/share/6ab54d11-7ccc-83e9-9f8b-9e1ea0d8ca18)

#### Alcance y contexto

Se utilizó ChatGPT como herramienta de apoyo para el desarrollo de la funcionalidad de Registro e Inicio de Sesión del proyecto. Se trabajó utilizando un mismo chat para realizar distintos prompts relacionados con la comprensión de la materia y con la implementación práctica de esta parte del frontend.

Al inicio de la conversación se entregó a la IA un archivo comprimido (.zip) con el repositorio del frontend actualizado hasta ese momento, junto con la pauta de la entrega y la propuesta del juego. A partir de este contexto, se realizaron diversas consultas relacionadas con el uso de useState, la organización de componentes, el manejo de formularios y las validaciones necesarias para el sistema de autenticación.

Las respuestas entregadas por la IA fueron utilizadas como apoyo para comprender conceptos, revisar alternativas de implementación y obtener ejemplos de código que posteriormente fueron adaptados e integrados al proyecto.

#### Prompts y ajustes del estudiante sobre la salida entregada

**Prompt 1 (Estructura inicial de Login y Registro):**
> "lee atentamente cada archivo de este zip. Quiero ahora hacer la Página de Registro e Inicio de Sesión (Login / Sign Up) según lo que piden en la pauta de la entrega 2. Ten en cuenta que ya existe un avance de lo que se pide en esta entrega, por lo que no debes considerar que el proyecto no existe. Ya cree los archivos en los que quiero distribuir el código, los cuales son los siguientes: src/components/Navbar.jsx , src/components/LoginForm.jsx , src/components/RegisterForm.jsx , src/pages/Login.jsx , src/styles/Login.css , src/styles/LoginForm.css y src/styles/RegisterForm.css. Ahora quiero que me indiques que debo implementar para demostrar dinamismo mediante el manejo de estado en React (useState, useEffect, etc.)"

Ajustes del estudiante sobre la salida: *"Se utilizaron las explicaciones entregadas para comprender el funcionamiento de useState y se desarrollaron los distintos archivos siguiendo el estilo del proyecto ya existente. Se definieron las divisiones entre componentes y se implementaron las restricciones necesarias para los formularios de login y registro."*

**Prompt 2 (Cambio entre formularios):**
> "para el register form como puedo hacer para cambair al inicio de sesion sin tener que salirme de la pagina orecargarla?"

Ajustes del estudiante sobre la salida: *"La lógica sugerida por la IA fue adaptada a la estructura existente del proyecto. Se ajustó el manejo de estados y la relación entre ambos formularios para mantener coherencia con la organización del frontend."*

**Prompt 3 (Generación de identificadores):**
> "como puedo crear ids para la simulació si actuamente tengo lo siguiente: function manejarSubmit(e) { e.preventDefault(); if (!validarFormulario()) { return; } const nuevoUsuario = { usuario_id: , nombre_usuario: nombreUsuario, correo: correo, contraseña: contraseña, rol: "Jugador" }; onRegister(nuevoUsuario); }"

Ajustes del estudiante sobre la salida: *"La IA sugirió utilizar Date.now() para generar IDs temporales. Esta solución fue implementada inicialmente e integrada al sistema de usuarios mock utilizado en la entrega"*

**Prompt 4 (Restricciones en el nombre de registro):**
> "en el registro de usuario, como evitar que se puedan ingresar espacios en el nombre de usuario. No deben haber espacios ni al inicio, ni al final ni entre medio. actualmente solo tengo: if (!nombreUsuario) {             nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";         } Que podría hacer para agregar lo que te estoy diciendo?"

Ajustes del estudiante sobre la salida: *"Se utilizó la solución propuesta para agregar una validación que verifica que el nombre de usuario no contenga espacios, ni al inicio, ni al final ni entre medio. La validación se incorporó dentro de las restricciones existentes del registro, manteniendo el mensaje de error y la estructura del código utilizada anteriormente."*

**Prompt 5 (Restricciones en el correo de registro):**
> "y como puedo poner la restricción del correo, para que siga un formato de texto + @ +texto + . + texto, es decir el formato estándar de un correo"

Ajustes del estudiante sobre la salida: *"Se incorporó una validación mediante una expresión regular para comprobar que el correo ingresado siga el formato estándar de texto + @ + texto + . + texto. Esta validación se agregó a las restricciones existentes del campo correo, manteniendo la estructura del formulario y mostrando un mensaje de error cuando el formato ingresado no es válido."*

#### Aporte y análisis

Se diseñó la estructura de los archivos, se integraron los componentes de inicio de sesión y registro, se definieron las restricciones de los formularios y se conectó el sistema con los datos mock de usuarios. La IA se utilizó principalmente como una herramienta de apoyo para comprender el funcionamiento de useState, resolver dudas específicas de implementación y obtener ejemplos de código que posteriormente fueron revisados, adaptados e integrados al proyecto.

Además, la IA se utilizó para analizar alternativas para la generación de IDs y para implementar algunas validaciones del formulario de registro. En todos los casos, el código entregado fue revisado y modificado antes de incorporarlo al proyecto final, asegurando que fuera coherente con los requerimientos de la entrega y con la estructura general del repositorio.


### Caso de uso DRIPxlr8

[Link a la conversación](https://chatgpt.com/share/6ab9c26a-911c-83e9-9e21-1980b3ac26b3)

#### Alcance y contexto

Se utilizó ChatGPT para definir la estructura de carpetas y el orden de implementación del frontend. Se le entregaron la propuesta de la Entrega 1 y el enunciado de la Entrega 2 para que tuviera el contexto del juego y de lo exigido. A partir de eso, propuso una organización modular (layout, componentes de juego, páginas, servicios, mocks, hooks, contexto y utilidades), junto con un orden de trabajo por fases (configuración, navegación, protocolo y mocks, autenticación, tablero y cierre).

Esta propuesta se utilizó como referencia y no como una plantilla para copiar.

#### Prompt y ajustes del estudiante sobre la salida entregada

**Prompt 1 (Estructura de carpetas):**
> "En base a lo solicitado en el proyecto y el contexto del juego que buscamos realizar a lo largo del semestre, que orden de archivos/carpetas me recomiendas implementar, se preciso con el orden y tu respuesta. Analiza los documentos para el contexto."

Ajustes del estudiante sobre la salida: *"La estructura propuesta no se implementó completa ni de una sola vez. Los archivos y carpetas se fueron creando de forma progresiva, según lo que cada avance de la entrega necesitaba, y no todos los sugeridos llegaron a crearse. Además, la IA proponía un archivo .css junto a cada componente; se decidió centralizar todos los estilos en `src/styles/` para mantener una sola ubicación y evitar confusiones dentro del equipo. Los nombres de componentes y carpetas también se adaptaron a los del proyecto (por ejemplo, Tablero, Casilla, Panel, Acciones, Crónica)."*

#### Aporte y análisis

La IA se utilizó para orientar la organización general y el orden de desarrollo. El aporte propio fue decidir qué parte de esa estructura era necesaria para cada avance, adaptarla al estado real del repositorio y cambiar el manejo de estilos hacia una carpeta centralizada. 

Además, se implementó `RutaProtegida.jsx`, adaptando un ejemplo de rutas protegidas de un tutorial externo (ver Decisiones técnicas y Referencias): se cambió el nombre del componente y de la prop, se agregó `replace` en `<Navigate>` y se comentó el código para explicar su funcionamiento.


## Referencias

**Material del curso**
- Cápsulas: https://github.com/IIC2513/Syllabus-S2/tree/main/C%C3%A1psulas
- Ayudantías: https://github.com/IIC2513/Syllabus-S2/tree/main/Ayudantias
- Repositorio de referencia Guess Who: https://github.com/IIC2513/guess-who

**React y React Router**
- useState: https://es.react.dev/reference/react/useState
- React Router (W3Schools): https://www.w3schools.com/react/react_router.asp
- Condicionales en JSX: https://www.w3schools.com/react/react_jsx_if_statements.asp
- Navegación: https://reactrouter.com/start/declarative/navigating
- useNavigate: https://reactrouter.com/api/hooks/useNavigate
- Rutas protegidas (base de `RutaProtegida`): https://www.amaza-ing.com/academy/React/Temas/React-20-Rutas-Protegidas
- Variables de entorno en Vite: https://vite.dev/guide/env-and-mode

**CSS**
- CSS Grid: https://lenguajecss.com/css/grid/que-es-grid/
- Cursor del ratón: https://lenguajecss.com/css/interacciones/cursor-del-raton/
- Filtros CSS: https://lenguajecss.com/css/efectos/filtros-css/
- Estilos, MDN: https://developer.mozilla.org/es/docs/Learn_web_development/Getting_started/Your_first_website/Styling_the_content
- Dimensionamiento, MDN: https://developer.mozilla.org/es/docs/Learn_web_development/Core/Styling_basics/Sizing
- Fuentes: https://www.mclibre.org/consultar/htmlcss/css/css-fuente.html
- Selector :visited: https://developer.mozilla.org/es/docs/Web/CSS/Reference/Selectors/:visited
- Cheatsheet CSS: https://lenguajecss.com/css/cheatsheets/download/css-cheatsheet-2026.pdf
- Cheatsheet HTML: https://lenguajehtml.com/html/cheatsheets/download/html-cheatsheet-2026.pdf

**HTTP y Markdown**
- Códigos de estado HTTP: https://developer.mozilla.org/es/docs/Web/HTTP/Reference/Status
- Bloques de código en Markdown: https://markdown.es/sintaxis-markdown/bloques-de-codigo/
- Sintaxis Markdown: https://markdown.es/sintaxis-markdown/