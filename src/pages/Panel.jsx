
import "../styles/Panel.css";

function Panel({ estadoPartida, usuarioActivo }) {
    const miEstado = estadoPartida.mi_estado || {};
    const tablero = estadoPartida.tablero || [];
    const unidades = estadoPartida.unidades || [];
    const mejoras = estadoPartida.mejoras || [];

    const jugadorId = miEstado.jugador_id;

    const misUnidades = unidades.filter(
        (unidad) =>
            String(unidad.jugador_id) === String(jugadorId)
    ).length;

    const miTerritorio = tablero.filter(
        (casilla) =>
            casilla.dueno_id !== null &&
            String(casilla.dueno_id) === String(jugadorId)
    ).length;

    const inventario = miEstado.inventario_mejoras || [];

    const finalizada = estadoPartida.estado === "finalizada";
    const esMiTurno =
        !finalizada && estadoPartida.jugador_en_turno != null &&
        String(estadoPartida.jugador_en_turno) ===
            String(jugadorId);

    const nombreEnTurno = esMiTurno
        ? usuarioActivo.nombre_usuario
        : estadoPartida.estado_oponente?.nombre_usuario ||
          "Oponente";

    return (
        <div className="grid-panel">
            <section className="cuadro">
                <h2>Estado</h2>

                <div className="valores-grid">
                    <div className="valores-caja">
                        <h3>Oro</h3>
                        <p>{miEstado.oro ?? 0}</p>
                    </div>

                    <div className="valores-caja">
                        <h3>Unidades</h3>
                        <p>{misUnidades}</p>
                    </div>

                    <div className="valores-caja">
                        <h3>Territorio</h3>
                        <p>
                            {miTerritorio}/{tablero.length}
                        </p>
                    </div>

                    <div className="valores-caja">
                        <h3>Inventario</h3>
                        <p>{inventario.length}</p>
                    </div>
                </div>
            </section>

            <section className="cuadro">
                <h2>Inventario</h2>

                <div className="valores-caja">
                    {inventario.length === 0 ? (
                        <p>No tienes mejoras disponibles.</p>
                    ) : (
                        inventario.map((mejoraId) => {
                            const mejora = mejoras.find(
                                (m) =>
                                    String(m.mejora_id) ===
                                    String(mejoraId)
                            );

                            return (
                                <p key={mejoraId}>
                                    {mejora?.tipo ||
                                        `Mejora ${mejoraId}`}
                                </p>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="cuadro">
                <h2>Turno</h2>

                <div className="valores-caja">
                    <p>
                        Turno actual: {estadoPartida.turno_actual}
                    </p>

                    {finalizada ? (
                        <>
                            <p>Partida finalizada</p>
                            <p>
                                Resultado: {estadoPartida.ganador_id == null
                                    ? "Empate"
                                    : String(estadoPartida.ganador_id) === String(jugadorId)
                                        ? "Victoria"
                                        : "Derrota"}
                            </p>
                        </>
                    ) : (
                        <>
                            <p>Jugador en turno: {nombreEnTurno}</p>
                            <p>{esMiTurno ? "Es tu turno" : "Turno del oponente"}</p>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Panel;