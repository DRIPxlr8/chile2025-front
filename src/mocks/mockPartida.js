function generarTableroBase() { // función para generar un tablero base de 8x8 con casillas vacías
    const casillas = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            casillas.push({ x, y, dueño_id: null, es_mina_oro: false, unidad_id: null });
        }
    }
    return casillas;
}

const tablero = generarTableroBase(); // genera el tablero base de 8x8 con casillas vacías

// se definen las posiciones de las minas de oro en el tablero
[{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }].forEach(({ x, y }) => {
    tablero.find(casilla => casilla.x === x && casilla.y === y).es_mina_oro = true;
});

// se definen las posiciones de las unidades en el tablero y se asigna el dueño de cada casilla
[
    { x: 1, y: 1, unidad_id: 1 },
    { x: 2, y: 1, unidad_id: 2 },
    { x: 3, y: 1, unidad_id: 3 },
    { x: 1, y: 2, unidad_id: null },
    { x: 2, y: 2, unidad_id: null },
].forEach(({ x, y, unidad_id }) => {
    const casilla = tablero.find(casilla => casilla.x === x && casilla.y === y);
    casilla.dueño_id = 1; // se asigna el dueño de la casilla como 1
    casilla.unidad_id = unidad_id; // se asigna la unidad correspondiente a la casilla
});

[
    { x: 4, y: 6, unidad_id: 4 },
    { x: 5, y: 6, unidad_id: 5 },
    { x: 4, y: 7, unidad_id: null },
    { x: 5, y: 7, unidad_id: null },
].forEach(({ x, y, unidad_id }) => {
    const casilla = tablero.find(casilla => casilla.x === x && casilla.y === y);
    casilla.dueño_id = 2;
    casilla.unidad_id = unidad_id;
});

// se definen las unidades de los jugadores con sus atributos y mejoras equipadas
const unidades = [
    { unidad_id: 1, jugador_id: 1, tipo: "caballero", casilla: { x: 1, y: 1 }, ataque_base: 3, defensa_base: 3, mejoras_equipadas: [1] },
    { unidad_id: 2, jugador_id: 1, tipo: "arquero", casilla: { x: 2, y: 1 }, ataque_base: 3, defensa_base: 2, mejoras_equipadas: [] },
    { unidad_id: 3, jugador_id: 1, tipo: "mago", casilla: { x: 3, y: 1 }, ataque_base: 2, defensa_base: 2, mejoras_equipadas: [] },
    { unidad_id: 4, jugador_id: 2, tipo: "arquero", casilla: { x: 4, y: 6 }, ataque_base: 3, defensa_base: 2, mejoras_equipadas: [] },
    { unidad_id: 5, jugador_id: 2, tipo: "mago", casilla: { x: 5, y: 6 }, ataque_base: 2, defensa_base: 2, mejoras_equipadas: [2] },
];

// se definen las mejoras disponibles en el juego con su tipo, bono y la unidad a la que están asignadas
const mejoras = [
    { mejora_id: 1, tipo: "espada_acero", bono: 1, unidad_id: 1 }, // equipada en unidad del jugador 1, corresponde a información pública
    { mejora_id: 2, tipo: "escudo_hierro", bono: 1, unidad_id: 5 }, // equipada en unidad del jugador 2, corresponde a información pública
    { mejora_id: 3, tipo: "espada_acero", bono: 1, unidad_id: null }, // no está equipada en ninguna unidad, corresponde a información privada del jugador 1
];

// se define un objeto de partida de ejemplo con su estado, turno actual, jugador en turno, tablero, unidades, mejoras y crónica de eventos
const mockPartida = {
    partida_id: 1,
    estado: "en_progreso",
    turno_actual: 8,
    jugador_en_turno: 2,
    tablero,
    unidades,
    mejoras,
    mi_estado: { jugador_id: 1, oro: 10, orden_turno: 1, inventario_mejoras: [3] },
    estado_oponente: { jugador_id: 2, orden_turno: 2 }, // solo se puede ver el jugador_id y orden_turno del oponente, no su oro ni inventario de mejoras
    cronica: [
        { turno: 6, descripcion: "Lyria conquistó una casilla neutral" },
        { turno: 7, descripcion: "Arkan recibió 3 de oro por territorio" },
        { turno: 8, descripcion: "Arkan equipó Espada de Acero a su Caballero" }
    ],
};

export default mockPartida; // se exporta el objeto de partida de ejemplo para que pueda ser utilizado en otros archivos