import { useState } from "react";
import Casillas from "./Casillas";
import Panel from "./Panel";
import Acciones from "./Acciones";
import Cronica from "./Cronica";
import '../styles/Tablero.css';

function Tablero() {
    const [seleccion, setSeleccion] = useState(null);
    return (
        <div className="contenedor-layout">
            <section className="seccion-izq">
                <Panel />
            </section>

            <section className="seccion-cen">
                <div className="contenedor-tablero">
                    <Casillas seleccion={seleccion} onSeleccionar={setSeleccion} />
                </div>
            </section>

            <section className="seccion-der grid-panel">
                <Acciones />
                <Cronica />
            </section>
        </div>
    );
}


export default Tablero;