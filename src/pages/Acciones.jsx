import { useState } from "react";
import "../styles/Acciones.css";
import "../styles/Panel.css";

function Acciones({ onAccion }) {
    const [seleccion, setSeleccion] = useState(null);
    function manejarAccion(nombreAccion) {
        setSeleccion(nombreAccion);
        onAccion();
    }
    return (
        <div className="panel">
            <div className="acciones-encabezado">
                <h2>Acciones</h2>
            </div>
            <div className="grid-acciones">
                <button
                    className={`boton-accion principal ${seleccion === "Mover / Atacar" ? "presionado" : ""}`}
                    onClick={() => manejarAccion("Mover / Atacar")}
                > Mover / Atacar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Reclutar" ? "presionado" : ""}`}
                    onClick={() => manejarAccion("Reclutar")}
                > Reclutar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Equipar" ? "presionado" : ""}`}
                    onClick={() => manejarAccion("Equipar")}
                > Equipar
                </button>
                <button
                    className={`boton-accion ${seleccion === "Pasar turno" ? "presionado" : ""}`}
                    onClick={() => manejarAccion("Pasar turno")}
                > Pasar Turno
                </button>
                <button
                    className={`boton-accion rendirse ${seleccion === "Rendirse" ? "presionado" : ""}`}
                    onClick={() => manejarAccion("Rendirse")}
                > Rendirse
                </button>
            </div>
        </div>
    );
}

export default Acciones;