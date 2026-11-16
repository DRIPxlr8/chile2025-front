import { useState } from "react";
import "../styles/Acciones.css";
import "../styles/Panel.css";

function Acciones({
    modoAccion,
    onSeleccionarModo,
    esMiTurno,
    finalizada,
    procesando,
    seleccion,
    jugadorId,
    tiposUnidad,
    catalogoMejoras,
    unidadesPropias,
    inventarioMejoras,
    errorCatalogo,
    onReclutar,
    onComprarMejora,
    onEquiparMejora,
    onPasarTurno,
    onRendirse,
    cargandoCatalogo,
}) {
    const [tipoUnidad, setTipoUnidad] = useState("caballero");
    const [tipoMejora, setTipoMejora] = useState("");
    const [unidadId, setUnidadId] = useState("");
    const [mejoraId, setMejoraId] = useState("");

    const puedeActuar = esMiTurno && !finalizada && !procesando;

    const casillaPropiaVacia =
        seleccion != null &&
        seleccion.unidad_id == null &&
        String(seleccion.dueno_id) === String(jugadorId);

    if (finalizada) {
        return (
            <div className="panel">
                <h2>Acciones</h2>
                <p>La partida ha finalizado. Ya no puedes realizar jugadas ni rendirte.</p>
            </div>
        );
    }

    function cambiarModo(modo) {
        onSeleccionarModo(modoAccion === modo ? null : modo);
    }

    return (
        <div className="panel">
            <div className="acciones-encabezado">
                <h2>Acciones</h2>
                {procesando && (
                    <p
                        className="acciones-estado-carga"
                        role="status"
                        aria-live="polite"
                    >
                        Procesando acción...
                    </p>
                )}               
            </div>

            {!esMiTurno && (
                <p>
                    Es el turno del oponente. Puedes volver a actuar
                    cuando te corresponda.
                </p>
            )}

            <div className="grid-acciones">
                <button
                    type="button"
                    className={`boton-accion principal ${
                        modoAccion === "mover" ? "presionado" : ""
                    }`}
                    onClick={() => cambiarModo("mover")}
                    disabled={!puedeActuar}
                >
                    Mover / Atacar
                </button>

                <button
                    type="button"
                    className={`boton-accion ${
                        modoAccion === "reclutar" ? "presionado" : ""
                    }`}
                    onClick={() => cambiarModo("reclutar")}
                    disabled={!puedeActuar}
                >
                    Reclutar
                </button>

                <button
                    type="button"
                    className={`boton-accion ${
                        modoAccion === "comprar" ? "presionado" : ""
                    }`}
                    onClick={() => cambiarModo("comprar")}
                    disabled={!puedeActuar}
                >
                    Comprar mejora
                </button>

                <button
                    type="button"
                    className={`boton-accion ${
                        modoAccion === "equipar" ? "presionado" : ""
                    }`}
                    onClick={() => cambiarModo("equipar")}
                    disabled={!puedeActuar}
                >
                    Equipar mejora
                </button>

                <button
                    type="button"
                    className="boton-accion"
                    onClick={onPasarTurno}
                    disabled={!puedeActuar}
                >
                    Pasar turno
                </button>

                <button
                    type="button"
                    className="boton-accion rendirse"
                    onClick={onRendirse}
                    disabled={procesando}
                >
                    Rendirse
                </button>
            </div>

            {modoAccion === "mover" && (
                <div className="acciones-formulario">
                    <h3>Mover / Atacar</h3>
                    <p>
                        Selecciona una unidad propia y después una casilla
                        vecina. Si hay una unidad rival, el servidor
                        resolverá el combate.
                    </p>
                </div>
            )}

            {modoAccion === "reclutar" && (
                <div className="acciones-formulario">
                    <h3>Reclutar unidad</h3>

                    <label htmlFor="tipo-unidad">
                        Tipo de unidad
                    </label>

                    <select
                        id="tipo-unidad"
                        value={tipoUnidad}
                        onChange={(e) => setTipoUnidad(e.target.value)}
                        disabled={procesando}
                    >
                        {tiposUnidad.map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>

                    <p>
                        {seleccion
                            ? `Casilla seleccionada: (${seleccion.x}, ${seleccion.y})`
                            : "Selecciona una casilla propia y vacía del tablero."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            onReclutar(tipoUnidad, seleccion)
                        }
                        disabled={
                            !puedeActuar ||
                            !casillaPropiaVacia ||
                            tiposUnidad.length === 0
                        }
                    >
                        Reclutar en casilla seleccionada
                    </button>
                </div>
            )}

            {modoAccion === "comprar" && (
                <div className="acciones-formulario">
                    <h3>Comprar mejora</h3>

                    {cargandoCatalogo && (
                        <p role="status">
                            Cargando catálogo de mejoras...
                        </p>
                    )}

                    {errorCatalogo && (
                        <p className="acciones-estado-error" role="alert">
                            {errorCatalogo}
                        </p>
                    )}

                    <label htmlFor="tipo-mejora">
                        Mejora disponible
                    </label>

                    <select
                        id="tipo-mejora"
                        value={tipoMejora}
                        onChange={(e) => setTipoMejora(e.target.value)}
                        disabled={procesando || cargandoCatalogo}
                    >
                        <option value="">
                            Selecciona una mejora
                        </option>

                        {catalogoMejoras.map((mejora) => (
                            <option
                                key={mejora.tipo}
                                value={mejora.tipo}
                            >
                                {mejora.tipo} — {mejora.atributo} +{mejora.bono} — {mejora.precio} oro
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => onComprarMejora(tipoMejora)}
                        disabled={
                            !puedeActuar ||
                            cargandoCatalogo ||
                            !tipoMejora ||
                            catalogoMejoras.length === 0
                        }
                    >
                        Comprar mejora
                    </button>

                    <p>
                        Comprar una mejora no consume el turno según
                        las reglas actuales del backend.
                    </p>
                </div>
            )}

            {modoAccion === "equipar" && (
                <div className="acciones-formulario">
                    <h3>Equipar mejora</h3>

                    <label htmlFor="unidad-equipar">
                        Unidad propia
                    </label>

                    <select
                        id="unidad-equipar"
                        value={unidadId}
                        onChange={(e) => setUnidadId(e.target.value)}
                        disabled={procesando}
                    >
                        <option value="">
                            Selecciona una unidad
                        </option>

                        {unidadesPropias.map((unidad) => (
                            <option
                                key={unidad.unidad_id}
                                value={unidad.unidad_id}
                            >
                                {unidad.tipo} — Unidad #{unidad.unidad_id}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="mejora-equipar">
                        Mejora de tu inventario
                    </label>

                    <select
                        id="mejora-equipar"
                        value={mejoraId}
                        onChange={(e) => setMejoraId(e.target.value)}
                        disabled={procesando}
                    >
                        <option value="">
                            Selecciona una mejora
                        </option>

                        {inventarioMejoras.map((mejora) => (
                            <option
                                key={mejora.mejora_id}
                                value={mejora.mejora_id}
                            >
                                {mejora.tipo} — Mejora #{mejora.mejora_id}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() =>
                            onEquiparMejora(unidadId, mejoraId)
                        }
                        disabled={
                            !puedeActuar ||
                            !unidadId ||
                            !mejoraId
                        }
                    >
                        Equipar mejora
                    </button>
                </div>
            )}
        </div>
    );
}

export default Acciones;