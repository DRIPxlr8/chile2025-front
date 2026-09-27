import { useState } from "react";
import "../styles/Acciones.css";
import "../styles/Panel.css";

function Acciones() {
    const [seleccion, setSeleccion] = useState(null);
    return (
        <div className="panel">
            <div className="acciones-encabezado">
                <h2>Acciones</h2>
            </div>
            <div className="grid-acciones">
                <button
                    className={`boton-accion principal ${seleccion === "Mover / Atacar" ? "presionado" : ""}`}
                    onClick={() => setSeleccion("Mover / Atacar")}
                > Mover / Atacar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Reclutar" ? "presionado" : ""}`}
                    onClick={() => setSeleccion("Reclutar")}
                > Reclutar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Equipar" ? "presionado" : ""}`}
                    onClick={() => setSeleccion("Equipar")}
                > Equipar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Pasar Turno" ? "presionado" : ""}`}
                    onClick={() => setSeleccion("Pasar Turno")}
                > Pasar Turno
                </button>
                <button
                    className={`boton-accion rendirse ${seleccion === "Rendirse" ? "presionado" : ""}`}
                    onClick={() => setSeleccion("Rendirse")}
                > Rendirse
                </button>
            </div>
        </div>
    );
}

export default Acciones;