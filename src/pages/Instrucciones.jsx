import '../styles/Instrucciones.css';

function Instrucciones() {
    return (
        <>
            <section className="centrado">
                <p className="etiqueta">Cómo Jugar</p>
                <h1>Las reglas del reino</h1>
            </section>

            <section className="instruccion-bloque">
                <h2>Objetivo</h2>
                <p>Conquista el 60% del territorio del tablero antes que tu rival para proclamarte soberano del reino.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>El tablero</h2>
                <p>La partida se juega en un tablero de 8x8 casillas. Cada jugador comienza con sus unidades desplegadas en la fila más cercana a su lado del tablero, dejando la fila trasera vacía para reclutar nuevas unidades. Algunas casillas del centro son minas de oro, es decir, controlarlas aumenta tus ingresos cada turno.</p>
            </section>
            
            <section className="instruccion-bloque">
                <h2>Turnos</h2>
                <p>En cada turno puedes realizar una de estas acciones:</p>
                <ul>
                    <li><strong>Mover / Atacar:</strong> desplaza una unidad a una casilla vecina, o ataca a una unidad rival.</li>
                    <li><strong>Reclutar:</strong> crea una nueva unidad en una casilla vacía de tu territorio.</li>
                    <li><strong>Equipar mejora:</strong> intercambia una mejora de tu inventario a una de tus unidades.</li>
                    <li><strong>Pasar turno:</strong> cede el turno a tu rival sin realizar ninguna acción.</li>
                    <li><strong>Rendirse:</strong> termina la partida, dando la victoria a tu rival.</li>
                </ul>
                <p>Comprar mejoras con oro no consume tu turno, así que puedes hacerlo cuantas veces quieras antes de tu jugada principal.</p>
            </section>

            <section className="instruccion-bloque">
                <h2>Guerreros</h2>
                <p>Cada tipo de unidad tiene una ventaja natural sobre otra:</p>
                <ul>
                    <li><strong>Caballero:</strong> fuerte contra arqueros, pero débil contra magos.</li>
                    <li><strong>Arquero:</strong> fuerte contra magos, pero débil contra caballeros.</li>
                    <li><strong>Mago:</strong> fuerte contra caballeros, débil contra arqueros. Esta unidad tiene un 20% de probabilidad de generar oro adicional</li>
                </ul>
            </section>

            <section className="instruccion-bloque">
                <h2>Economía</h2>
                <p>Cada territorio que controlas te entrega oro al final del turno. Usa ese oro para comprar mejoras y equipar a tus unidades, fortaleciendo tu ejército con el paso de las rondas.</p>
            </section>
        </>
    )
}

export default Instrucciones;