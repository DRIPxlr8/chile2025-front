
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    listarPartidas,
    crearPartida,
    unirsePartida,
    consultarEstado,
    rendirse,
} from "../services/api";
import "../styles/Partidas.css";

function Partidas({ usuarioActivo }) {
    const navigate = useNavigate();
    const jugadorId = usuarioActivo.usuario_id;

    const [partidas, setPartidas] = useState([]);
    const [partidasActivas, setPartidasActivas] = useState([]);
    const [partidasFinalizadas, setPartidasFinalizadas] = useState([]);
    const [nombrePartida, setNombrePartida] = useState("");
    const [cargando, setCargando] = useState(true);
    const [procesando, setProcesando] = useState(false);
    const [partidaEnRendicion, setPartidaEnRendicion] = useState(null);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    const cargarPartidas = useCallback(async () => {
        setCargando(true);
        setError("");

        try {
            const [enEspera, enProgreso, finalizadas] = await Promise.all([
                listarPartidas("en_espera"),
                listarPartidas("en_progreso"),
                listarPartidas("finalizada"),
            ]);

            setPartidas(enEspera);

            const propias = [];

            for (const partida of enProgreso) {
                try {
                    await consultarEstado(partida.partida_id);
                    propias.push(partida);
                } catch (errorConsulta) {
                    if (
                        errorConsulta.status !== 403 &&
                        errorConsulta.status !== 404
                    ) {
                        throw errorConsulta;
                    }
                }
            }

            setPartidasActivas(propias);

            // Las listas son públicas, pero el estado solo puede consultarlo
            // un participante. De este modo mostramos únicamente sus resultados.
            const terminadasPropias = [];
            for (const partida of finalizadas) {
                try {
                    const estado = await consultarEstado(partida.partida_id);
                    const resultado = estado.ganador_id == null
                        ? "Empate"
                        : String(estado.ganador_id) === String(jugadorId)
                            ? "Victoria"
                            : "Derrota";
                    terminadasPropias.push({ ...partida, resultado });
                } catch (errorConsulta) {
                    if (errorConsulta.status !== 403 && errorConsulta.status !== 404) {
                        throw errorConsulta;
                    }
                }
            }
            setPartidasFinalizadas(terminadasPropias);
        } catch (errorCarga) {
            setError(
                errorCarga.message || "No se pudieron cargar las partidas."
            );
        } finally {
            setCargando(false);
        }
    }, [jugadorId]);

    useEffect(() => {
        const obtenerDatos = async () => {
            await cargarPartidas();
        };

        obtenerDatos();
    }, [cargarPartidas]);

    async function manejarCrear(e) {
        e.preventDefault();

        const nombre = nombrePartida.trim();

        if (!nombre) {
            setError("Debes ingresar un nombre para la partida.");
            return;
        }

        setError("");
        setMensaje("");
        setProcesando(true);

        try {
            await crearPartida({ nombre_partida: nombre });

            setNombrePartida("");
            setMensaje("Partida creada correctamente.");
            await cargarPartidas();
        } catch (errorCrear) {
            setError(errorCrear.message || "No se pudo crear la partida.");
        } finally {
            setProcesando(false);
        }
    }

    async function manejarUnirse(partida) {
        setError("");
        setMensaje("");
        setProcesando(true);

        try {
            await unirsePartida(partida.partida_id);

            navigate(
                `/juego?partida_id=${encodeURIComponent(partida.partida_id)}`
            );
        } catch (errorUnirse) {
            setError(errorUnirse.message || "No se pudo ingresar a la partida.");
        } finally {
            setProcesando(false);
        }
    }

    async function manejarRendirse(partida) {
        const confirmado = window.confirm(
            "¿Seguro que deseas rendirte? La partida finalizará y tu rival será declarado ganador. Esta acción no se puede deshacer."
        );

        if (!confirmado) {
            return;
        }

        setError("");
        setMensaje("");
        setPartidaEnRendicion(partida.partida_id);

        try {
            await rendirse(partida.partida_id, true);

            setMensaje(
                "Te has rendido. La partida terminó y ahora puedes jugar otra."
            );

            await cargarPartidas();
        } catch (errorRendicion) {
            setError(
                errorRendicion.message || "No se pudo finalizar la partida."
            );
        } finally {
            setPartidaEnRendicion(null);
        }
    }

    const tienePartidaEsperando = partidas.some(
        (partida) =>
            String(partida.creador_id) === String(jugadorId)
    );

    const tienePartidaActiva =
        tienePartidaEsperando || partidasActivas.length > 0;

    return (
        <section className="partidas-page">
            <div className="partidas-header">
                <div>
                    <p className="etiqueta">Scopper</p>
                    <h1>Partidas disponibles</h1>
                    <p>
                        Crea una partida o únete a una que esté
                        esperando a un segundo jugador.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={cargarPartidas}
                    disabled={cargando || procesando}
                >
                    {cargando ? "Cargando..." : "Actualizar lista"}
                </button>
            </div>

            {error && (
                <p className="partidas-mensaje-error" role="alert">
                    {error}
                </p>
            )}

            {mensaje && (
                <p className="partidas-mensaje-exito" role="status">
                    {mensaje}
                </p>
            )}

            <section className="partidas-crear">
                <h2>Crear partida</h2>

                <form
                    className="partidas-crear-form"
                    onSubmit={manejarCrear}
                >
                    <div className="partidas-crear-campo">
                        <label htmlFor="nombre-partida">
                            Nombre de la partida
                        </label>

                        <input
                            id="nombre-partida"
                            type="text"
                            value={nombrePartida}
                            onChange={(e) =>
                                setNombrePartida(e.target.value)
                            }
                            maxLength={100}
                            placeholder="Nombre de la partida"
                            required
                            disabled={procesando || tienePartidaActiva}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={procesando || tienePartidaActiva}
                    >
                        Crear partida
                    </button>
                </form>

                {tienePartidaActiva && (
                    <p>
                        Ya tienes una partida activa. Puedes continuarla
                        o rendirte si deseas empezar otra.
                    </p>
                )}
            </section>

            <section>
                <h2>Partidas esperando rival</h2>

                {cargando ? (
                    <p>Cargando partidas...</p>
                ) : partidas.length === 0 ? (
                    <p>No hay partidas disponibles.</p>
                ) : (
                    <div className="partidas-lista">
                        {partidas.map((partida) => {
                            const esPropia =
                                String(partida.creador_id) ===
                                String(jugadorId);

                            return (
                                <article
                                    className="partida-card"
                                    key={partida.partida_id}
                                >
                                    <h3>{partida.nombre_partida}</h3>

                                    <p>
                                        Creador:{" "}
                                        {partida.nombre_creador ||
                                            "No disponible"}
                                    </p>

                                    <p>
                                        Estado: {partida.estado}
                                    </p>

                                    {esPropia ? (
                                        <p>Esperando a otro jugador.</p>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                manejarUnirse(partida)
                                            }
                                            disabled={
                                                procesando ||
                                                tienePartidaActiva
                                            }
                                        >
                                            Unirse a la partida
                                        </button>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>

            {partidasActivas.length > 0 && (
                <section>
                    <h2>Tus partidas en curso</h2>

                    <p>
                        Estas partidas siguen activas aunque hayas
                        salido de la pantalla del juego.
                    </p>

                    <div className="partidas-lista">
                        {partidasActivas.map((partida) => (
                            <article
                                className="partida-card"
                                key={partida.partida_id}
                            >
                                <h3>{partida.nombre_partida}</h3>

                                <p>
                                    Partida #{partida.partida_id}
                                </p>

                                <p>Estado: en progreso</p>

                                <div className="partidas-acciones">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/juego?partida_id=${encodeURIComponent(partida.partida_id)}`
                                            )
                                        }
                                        disabled={procesando || partidaEnRendicion !== null}
                                    >
                                        Volver a la partida
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => manejarRendirse(partida)}
                                        disabled={procesando || partidaEnRendicion !== null}
                                    >
                                        {partidaEnRendicion === partida.partida_id
                                            ? "Finalizando..."
                                            : "Rendirse y abandonar"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}
            {partidasFinalizadas.length > 0 && (
                <section className="partidas-finalizadas">
                    <h2>Tus partidas finalizadas</h2>
                    <p>Puedes revisar el resultado y la crónica cuando quieras.</p>

                    <div className="partidas-lista">
                        {partidasFinalizadas.map((partida) => (
                            <article className="partida-card" key={partida.partida_id}>
                                <h3>{partida.nombre_partida}</h3>
                                <p>Partida #{partida.partida_id}</p>
                                <p>Resultado: <strong>{partida.resultado}</strong></p>
                                <button
                                    type="button"
                                    onClick={() => navigate(
                                        `/juego?partida_id=${encodeURIComponent(partida.partida_id)}`
                                    )}
                                    disabled={procesando}
                                >
                                    Ver resultado
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </section>
    );
}

export default Partidas;