
function Casilla({
    x,
    y,
    es_mina_oro,
    dueno_id,
    unidad_id,
    tipoUnidad,
    jugadorActivoId,
    esSeleccionada,
    alHacerClick,
}) {
    let clase = "casilla";

    if (es_mina_oro) {
        clase += " mina-oro";
    }

    if (dueno_id === null || dueno_id === undefined) {
        clase += " base";
    } else if (
        String(dueno_id) === String(jugadorActivoId)
    ) {
        clase += " jugador";
    } else {
        clase += " enemigo";
    }

    if (unidad_id !== null && unidad_id !== undefined) {
        clase += " unidad";
    }

    if (esSeleccionada) {
        clase += " seleccionada";
    }

    return (
        <div className={clase} onClick={alHacerClick}>
            <span className="casilla-coordenadas">
                {x},{y}
            </span>

            {unidad_id !== null &&
                unidad_id !== undefined && (
                    <span className="etiqueta-unidad">
                        {tipoUnidad || "Unidad"}
                    </span>
                )}
        </div>
    );
}

export default Casilla;
