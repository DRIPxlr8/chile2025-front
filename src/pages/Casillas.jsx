import Casilla from "./Casilla";

function Casillas({
    tablero = [],
    unidades = [],
    jugadorActivoId,
    seleccion,
    onSeleccionar,
}) {
    return (
        <div className="grid-tablero">
            {tablero.map((casilla) => {
                const id = `${casilla.x}-${casilla.y}`;

                const unidad = unidades.find(
                    (u) =>
                        String(u.unidad_id) ===
                        String(casilla.unidad_id)
                );

                return (
                    <Casilla
                        key={id}
                        x={casilla.x}
                        y={casilla.y}
                        es_mina_oro={casilla.es_mina_oro}
                        dueno_id={casilla.dueno_id}
                        unidad_id={casilla.unidad_id}
                        tipoUnidad={unidad?.tipo}
                        jugadorActivoId={jugadorActivoId}
                        esSeleccionada={
                            seleccion != null &&
                            Number(seleccion.x) === Number(casilla.x) &&
                            Number(seleccion.y) === Number(casilla.y)
                        }
                        alHacerClick={() => onSeleccionar(casilla)}
                    />
                );
            })}
        </div>
    );
}

export default Casillas;

