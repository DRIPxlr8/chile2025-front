import mockPartida from "../mocks/mockPartida";

function Casilla({ x, y, es_mina_oro, dueño_id, unidad_id, esSeleccionada, alHacerClick }) {
    let clase = "casilla";
    // mina de oro
    if (es_mina_oro) {
        clase += " mina-oro";
    }
    // jugador
    if (dueño_id === 1) {
        clase += " jugador";
    }
    // enemigo
    if (dueño_id === 2) {
        clase += " enemigo";
    }
    // base
    if (dueño_id === null) {
        clase += " base";
    }
    // unidad
    if (unidad_id != null) {
        clase += " unidad";
    }
    // casilla seleccionada
    if (esSeleccionada) {
        clase += " seleccionada";
    }
    // se busca la unidad para obtener su tipo
    const unidad = mockPartida.unidades.find((unidad) => unidad.unidad_id === unidad_id);
    return (
        <div className={clase} onClick={alHacerClick}>
            <span className="casilla-coordenadas">{x},{y}</span>
            {unidad_id != null && (
                <span className="etiqueta-unidad">{unidad?.tipo}</span>
            )}
        </div>
    );
}

export default Casilla;