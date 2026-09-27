import mockPartida from "../mocks/mockPartida";
import Casilla from "./Casilla";
function Casillas({ seleccion, onSeleccionar }) {
    const casillas = mockPartida.tablero;
    return (
        <div className="grid-tablero">
            {/* se identifica cada casilla por coordenadas y se extraen sus datos */}
            {casillas.map((casilla) => {
                const id = `${casilla.x}-${casilla.y}`;
                return (
                    <Casilla
                        key={id}
                        x={casilla.x}
                        y={casilla.y}
                        es_mina_oro={casilla.es_mina_oro}
                        dueño_id={casilla.dueño_id}
                        unidad_id={casilla.unidad_id}
                        esSeleccionada={id === seleccion}
                        alHacerClick={() => onSeleccionar(id)}
                    />
                )
            })}
        </div>
    );
}

export default Casillas;