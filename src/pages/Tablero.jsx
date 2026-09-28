import { useState } from "react";
import mockPartida from "../mocks/mockPartida.js";
import Casillas from "./Casillas";
import Panel from "./Panel";
import Acciones from "./Acciones";
import Cronica from "./Cronica";
import '../styles/Tablero.css';

function Tablero() {
    const [seleccion, setSeleccion] = useState(null);

    const [turnoActual, setTurnoActual] = useState(mockPartida.turno_actual);
    function avanzarTurno() {
        setTurnoActual((t) => t + 1);
    }
    return (
        <div className="contenedor-layout">
            <section className="seccion-izq">
                <Panel turnoActual={turnoActual} />
            </section>

            <section className="seccion-cen">
                <div className="contenedor-tablero">
                    <Casillas seleccion={seleccion} onSeleccionar={setSeleccion} />
                </div>
            </section>

            <section className="seccion-der grid-panel">
                <Acciones onAccion={avanzarTurno} />
                <Cronica />
            </section>
        </div>
    );
}


export default Tablero;