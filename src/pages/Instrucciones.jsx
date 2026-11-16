import '../styles/Instrucciones.css';

function Instrucciones() {
    return (
        <>
            <section className="centrado">
                <p className="etiqueta">Cómo jugar</p>
                <h1>Las reglas del reino</h1>
            </section>

            <section className="instruccion-bloque">
                <h2>Objetivo y final de la partida</h2>
                <p>Ganas al controlar 39 de las 64 casillas (al menos el 60 % del tablero), o si tu rival pierde todo su territorio.</p>
                <p>Si nadie gana antes, al cerrar el turno 40 gana quien controle más casillas. Si empatan en territorio, gana quien tenga más oro. Si también empatan en oro, la partida termina en empate.</p>
                <p>También puedes rendirte en cualquier momento mientras la partida esté en progreso; en ese caso gana tu rival.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>El tablero</h2>
                <p>La partida se juega en un tablero de 8 × 8 casillas. Cada jugador comienza con sus unidades desplegadas cerca de su lado. Algunas casillas son minas de oro, que aumentan los ingresos cuando están bajo tu control.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>Acciones y turnos</h2>
                <p>En tu turno puedes elegir una acción principal:</p>
                <ul>
                    <li><strong>Mover / Atacar:</strong> mueve una unidad a una casilla vecina y combate si corresponde.</li>
                    <li><strong>Reclutar:</strong> crea una unidad en una casilla propia, vacía y válida, pagando su costo.</li>
                    <li><strong>Equipar mejora:</strong> equipa una mejora de tu inventario a una unidad propia, sin intercambiar mejoras equipadas.</li>
                    <li><strong>Pasar turno:</strong> termina tu turno sin realizar otra jugada principal.</li>
                </ul>
                <p>Comprar mejoras no consume el turno. El jugador que recibe el turno obtiene el ingreso por territorio y minas, además de posibles bonos de magos.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>Guerreros</h2>
                <ul>
                    <li><strong>Caballero:</strong> tiene ventaja contra arqueros.</li>
                    <li><strong>Arquero:</strong> tiene ventaja contra magos.</li>
                    <li><strong>Mago:</strong> tiene ventaja contra caballeros.</li>
                </ul>
                <p>Cada mago vivo tiene un 20 % de probabilidad de dar 1 oro adicional cuando su jugador recibe el turno, con un máximo de 3 de oro extra por turno.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>Eventos aleatorios</h2>
                <p>Cada cinco turnos cerrados existe un 30 % de probabilidad de que ocurra un evento:</p>
                <ul>
                    <li><strong>Incursión:</strong> neutraliza de una a dos casillas de cada jugador y destruye las unidades y mejoras equipadas que se encuentren allí.</li>
                    <li><strong>Bendición:</strong> entrega 3 de oro a cada jugador.</li>
                </ul>
                <p>El resultado, los eventos y el historial quedan registrados por el servidor, y se muestran en el tablero y la crónica.</p>
            </section>
        </>
    );
}

export default Instrucciones;