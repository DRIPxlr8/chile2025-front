import mockPartida from "../mocks/mockPartida";
import mockUsuarios from "../mocks/mockUsuarios";
import "../styles/Panel.css";

function Panel({ turnoActual }) {
    const mi_estado = mockPartida.mi_estado;
    const nombre_usuario = mockUsuarios.find((usuarios) =>
        usuarios.usuario_id === mockPartida.jugador_en_turno).nombre_usuario;
    const mejoras = mockPartida.mejoras;

    const misUnidades = mockPartida.unidades.filter((unidades) => unidades.jugador_id === mi_estado.jugador_id).length;
    const miTerritorio = mockPartida.tablero.filter((casillas) => casillas.dueño_id === mi_estado.jugador_id).length;

    return (
        <div className="grid-panel">
            <section className="cuadro">
                <h2>Estado</h2>
                <div className="valores-grid">
                    <div className="valores-caja">
                        <h3>Oro</h3>
                        <p>{mi_estado.oro}</p>
                    </div>
                    <div className="valores-caja">
                        <h3>Unidades</h3>
                        <p>{misUnidades}</p>
                    </div>
                    <div className="valores-caja">
                        <h3>Territorio</h3>
                        <p>{miTerritorio}/64</p>
                    </div>
                    <div className="valores-caja">
                        <h3>Inventario</h3>
                        <p>{mi_estado.inventario_mejoras.length}</p>
                    </div>
                </div>
            </section>
            <section className="cuadro">
                <h2>Inventario</h2>
                <div className="valores-caja">
                    {mi_estado.inventario_mejoras.map((mejora_id) => {
                        const mejora = mejoras.find((mejora) => mejora.mejora_id === mejora_id);
                        return <p key={mejora_id}>{mejora?.tipo}</p>;
                    })}
                </div>
            </section>
            <section className="cuadro">
                <h2>Turno</h2>
                <div className="valores-caja">
                    <p>Turno actual: {turnoActual}</p>
                    <p>Jugador en turno: {nombre_usuario}</p>
                </div>
            </section>
        </div>
    );
}

export default Panel;