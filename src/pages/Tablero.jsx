import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    consultarEstado,
    consultarCronica,
    listarTiposMejora,
    moverUnidad,
    reclutarUnidad,
    comprarMejora,
    equiparMejora,
    pasarTurno,
    rendirse as rendirseAPI,
} from "../services/api";
import Casillas from "./Casillas";
import Panel from "./Panel";
import Acciones from "./Acciones";
import Cronica from "./Cronica";
import usePartidaSocket from "../hooks/usePartidaSocket";
import "../styles/Tablero.css";

function Tablero({ usuarioActivo }) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const partidaId = searchParams.get("partida_id");
    const jugadorId = usuarioActivo?.usuario_id;

    const [estadoPartida, setEstadoPartida] = useState(null);
    const [cronica, setCronica] = useState([]);
    const [catalogoMejoras, setCatalogoMejoras] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);

    const [error, setError] = useState("");
    const [errorCronica, setErrorCronica] = useState("");
    const [errorCatalogo, setErrorCatalogo] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargandoCronica, setCargandoCronica] = useState(true);
    const [cargandoCatalogo, setCargandoCatalogo] = useState(true);

    const [modoAccion, setModoAccion] = useState(null);
    const [seleccion, setSeleccion] = useState(null);
    const [origenMovimiento, setOrigenMovimiento] = useState(null);
    // Evita que una consulta antigua sobrescriba una actualización más reciente.
    const ultimaCarga = useRef(0);

    const cargarDatos = useCallback(async () => {
        const numeroCarga = ++ultimaCarga.current;

        if (!partidaId || jugadorId == null) {
            setError("Falta el identificador de la partida o del jugador.");
            setCargando(false);
            return;
        }

        setCargando(true);
        setCargandoCronica(true);
        setCargandoCatalogo(true);
        setError("");

        try {
            const estado = await consultarEstado(partidaId);
            if (numeroCarga !== ultimaCarga.current) return;

            setEstadoPartida(estado);
            if (estado.estado === "finalizada") {
                setModoAccion(null);
                setSeleccion(null);
                setOrigenMovimiento(null);
            }

            // La crónica y el catálogo se consultan sin bloquearse entre sí.
            const [resultadoCronica, resultadoCatalogo] = await Promise.allSettled([
                consultarCronica(partidaId),
                listarTiposMejora(),
            ]);
            if (numeroCarga !== ultimaCarga.current) return;

            if (resultadoCronica.status === "fulfilled") {
                setCronica(Array.isArray(resultadoCronica.value) ? resultadoCronica.value : []);
                setErrorCronica("");
            } else {
                setCronica(Array.isArray(estado.cronica) ? estado.cronica : []);
                setErrorCronica("No se pudo cargar la crónica completa. Se muestran los eventos recientes.");
            }

            if (resultadoCatalogo.status === "fulfilled") {
                setCatalogoMejoras(Array.isArray(resultadoCatalogo.value) ? resultadoCatalogo.value : []);
                setErrorCatalogo("");
            } else {
                setCatalogoMejoras([]);
                setErrorCatalogo(resultadoCatalogo.reason?.message || "No se pudo cargar el catálogo de mejoras.");
            }
        } catch (errorConsulta) {
            if (numeroCarga !== ultimaCarga.current) return;
            setEstadoPartida(null);
            setCronica([]);
            setError(errorConsulta.message || "No se pudieron cargar los datos de la partida.");
        } finally {
            if (numeroCarga === ultimaCarga.current) {
                setCargando(false);
                setCargandoCronica(false);
                setCargandoCatalogo(false);
            }
        }
    }, [partidaId, jugadorId]);

    useEffect(() => {
        let activo = true;

        queueMicrotask(() => {
            if (activo) {
                cargarDatos();
            }
        });

        return () => {
            activo = false;
            ultimaCarga.current += 1;
        };
    }, [cargarDatos]);
    
    // C3 ya implementó la conexión y suscripción Socket.IO.
    // B3 actualiza el tablero al recibir un aviso, sin duplicar lógica.
    usePartidaSocket({
        token: usuarioActivo?.token,
        partidaId,
        onActualizada: cargarDatos,
    });

    const finalizada = estadoPartida?.estado === "finalizada";
    const esMiTurno =
        estadoPartida?.estado === "en_progreso" &&
        estadoPartida.jugador_en_turno != null &&
        String(estadoPartida.jugador_en_turno) === String(jugadorId);

    const resultado = !finalizada
        ? null
        : estadoPartida.ganador_id == null
            ? "Empate"
            : String(estadoPartida.ganador_id) === String(jugadorId)
                ? "Victoria"
                : "Derrota";

    const unidades = estadoPartida?.unidades || [];

    const unidadesPropias = unidades.filter(
        (unidad) =>
            String(unidad.jugador_id) === String(jugadorId)
    );

    const tiposUnidad = [
        ...new Set([
            "caballero",
            "arquero",
            "mago",
            ...unidades.map((unidad) => unidad.tipo),
        ]),
    ];

    const mejoras = estadoPartida?.mejoras || [];
    const idsInventario =
        estadoPartida?.mi_estado?.inventario_mejoras || [];

    const inventarioMejoras = idsInventario
        .map((id) =>
            mejoras.find(
                (mejora) =>
                    String(mejora.mejora_id) === String(id)
            )
        )
        .filter(Boolean);

    async function ejecutarAccion(peticion, mensajeExito) {
        if (finalizada || procesando) return;
        setError("");
        setMensaje("");
        setProcesando(true);

        try {
            await peticion();

            setMensaje(mensajeExito);
            setModoAccion(null);
            setOrigenMovimiento(null);
            setSeleccion(null);

            await cargarDatos();
        } catch (errorAccion) {
            setError(
                errorAccion.message || "No se pudo completar la acción."
            );
        } finally {
            setProcesando(false);
        }
    }

    function manejarCambioModo(modo) {
        if (finalizada) return;
        setModoAccion(modo);
        setSeleccion(null);
        setOrigenMovimiento(null);
        setError("");
        setMensaje("");
    }

    async function manejarSeleccionCasilla(casilla) {
        setError("");
        setMensaje("");

        if (procesando || finalizada) {
            return;
        }

        if (modoAccion !== "mover") {
            setSeleccion(casilla);
            return;
        }

        if (!esMiTurno) {
            setError("No es tu turno.");
            return;
        }

        if (!origenMovimiento) {
            const unidad = unidades.find(
                (u) =>
                    String(u.unidad_id) ===
                    String(casilla.unidad_id)
            );

            if (!unidad) {
                setError("Selecciona una casilla que tenga una unidad.");
                return;
            }

            if (String(unidad.jugador_id) !== String(jugadorId)) {
                setError("Solo puedes mover tus propias unidades.");
                return;
            }

            setOrigenMovimiento(unidad);
            setSeleccion(casilla);
            setMensaje(
                `Unidad ${unidad.tipo} seleccionada. Ahora elige una casilla vecina.`
            );
            return;
        }

        if (
            Number(origenMovimiento.casilla?.x) === Number(casilla.x) &&
            Number(origenMovimiento.casilla?.y) === Number(casilla.y)
        ) {
            setOrigenMovimiento(null);
            setSeleccion(null);
            setMensaje("Selección cancelada.");
            return;
        }

        await ejecutarAccion(
            () =>
                moverUnidad(
                    partidaId,
                    origenMovimiento.unidad_id,
                    { x: casilla.x, y: casilla.y }
                ),
            "Movimiento o combate realizado."
        );
    }

    async function manejarReclutar(tipoUnidad, casilla) {
        if (!casilla) {
            setError("Selecciona primero una casilla propia y vacía.");
            return;
        }

        await ejecutarAccion(
            () =>
                reclutarUnidad(
                    partidaId,
                    { x: casilla.x, y: casilla.y },
                    tipoUnidad
                ),
            "Unidad reclutada correctamente."
        );
    }

    async function manejarComprarMejora(tipoMejora) {
        if (!tipoMejora) {
            setError("Selecciona una mejora.");
            return;
        }

        await ejecutarAccion(
            () => comprarMejora(partidaId, tipoMejora),
            "Mejora comprada correctamente."
        );
    }

    async function manejarEquiparMejora(unidadId, mejoraId) {
        if (!unidadId || !mejoraId) {
            setError("Selecciona una unidad y una mejora.");
            return;
        }

        await ejecutarAccion(
            () =>
                equiparMejora(
                    partidaId,
                    unidadId,
                    mejoraId
                ),
            "Mejora equipada correctamente."
        );
    }

    async function manejarPasarTurno() {
        if (
            !window.confirm("¿Quieres terminar tu turno?")
        ) {
            return;
        }

        await ejecutarAccion(
            () => pasarTurno(partidaId),
            "Turno finalizado correctamente."
        );
    }

    async function manejarRendirse() {
        if (finalizada || procesando) return;
        if (
            !window.confirm(
                "¿Seguro que deseas rendirte? Tu rival será declarado ganador."
            )
        ) {
            return;
        }

        setError("");
        setProcesando(true);

        try {
            await rendirseAPI(partidaId, true);
            setMensaje("Rendición registrada correctamente.");
            await cargarDatos();
        } catch (errorRendicion) {
            setError(
                errorRendicion.message || "No se pudo registrar la rendición."
            );
        } finally {
            setProcesando(false);
        }
    }

    if (!partidaId) {
        return (
            <section className="contenedor-layout">
                <p>No se indicó la partida que quieres abrir.</p>
                <button
                    type="button"
                    onClick={() => navigate("/partidas")}
                >
                    Volver a partidas
                </button>
            </section>
        );
    }

    if (cargando && !estadoPartida) {
        return (
            <section className="contenedor-layout">
                <p>Cargando partida...</p>
            </section>
        );
    }

    if (!estadoPartida) {
        return (
            <section className="contenedor-layout">
                <p role="alert">
                    {error || "No se pudo cargar la partida."}
                </p>

                <button type="button" onClick={cargarDatos}>
                    Reintentar
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/partidas")}
                >
                    Volver a partidas
                </button>
            </section>
        );
    }

    return (
        <div className="contenedor-layout">
            <section className="seccion-izq">
                <Panel
                    estadoPartida={estadoPartida}
                    usuarioActivo={usuarioActivo}
                />
            </section>

            <section className="seccion-cen">
                {finalizada && (
                    <section className="resultado-partida" role="status" aria-live="polite">
                        <h2>{resultado}</h2>
                        <p>
                            {resultado === "Victoria"
                                ? "Ganaste la partida."
                                : resultado === "Derrota"
                                    ? "Tu rival ganó la partida."
                                    : "La partida terminó sin ganador."}
                        </p>
                        <p>La partida terminó en el turno {estadoPartida.turno_actual}.</p>
                        <button type="button" onClick={() => navigate("/partidas")}>
                            Volver a partidas
                        </button>
                    </section>
                )}

                {mensaje && (
                    <p role="status">{mensaje}</p>
                )}

                {error && (
                    <p role="alert">{error}</p>
                )}

                <button
                    type="button"
                    onClick={cargarDatos}
                    disabled={cargando || procesando}
                >
                    {cargando ? "Actualizando..." : "Actualizar tablero"}
                </button>

                <div className="leyenda-tablero">
                    <div className="leyenda-item">
                        <span className="leyenda-color leyenda-propio"></span>
                        <span>
                            Tu territorio: {usuarioActivo.nombre_usuario}
                        </span>
                    </div>

                    <div className="leyenda-item">
                        <span className="leyenda-color leyenda-rival"></span>
                        <span>
                            Territorio rival:{" "}
                            {estadoPartida.estado_oponente?.nombre_usuario || "Oponente"}
                        </span>
                    </div>

                    <div className="leyenda-item">
                        <span className="leyenda-color leyenda-neutral"></span>
                        <span>Casilla neutral</span>
                    </div>
                </div>
                
                <div className="contenedor-tablero">
                    <Casillas
                        tablero={estadoPartida.tablero || []}
                        unidades={unidades}
                        jugadorActivoId={jugadorId}
                        seleccion={seleccion}
                        onSeleccionar={manejarSeleccionCasilla}
                    />
                </div>
            </section>

            <section className="seccion-der grid-panel">
                <Acciones
                    modoAccion={modoAccion}
                    onSeleccionarModo={manejarCambioModo}
                    esMiTurno={esMiTurno}
                    finalizada={finalizada}
                    procesando={procesando}
                    seleccion={seleccion}
                    jugadorId={jugadorId}
                    tiposUnidad={tiposUnidad}
                    catalogoMejoras={catalogoMejoras}
                    unidadesPropias={unidadesPropias}
                    inventarioMejoras={inventarioMejoras}
                    errorCatalogo={errorCatalogo}
                    onReclutar={manejarReclutar}
                    onComprarMejora={manejarComprarMejora}
                    onEquiparMejora={manejarEquiparMejora}
                    onPasarTurno={manejarPasarTurno}
                    onRendirse={manejarRendirse}
                    cargandoCatalogo={cargandoCatalogo}
                />

                <Cronica
                    eventos={cronica}
                    error={errorCronica}
                    cargando={cargandoCronica}
                />
            </section>
        </div>
    );
}

export default Tablero;