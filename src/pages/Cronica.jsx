import "../styles/Panel.css";
import "../styles/Cronica.css";

function Cronica({
    eventos = [],
    error = "",
    cargando = false,
}) {
    return (
        <div className="cuadro" aria-busy={cargando}>
            <div className="cronica-encabezado">
                <h2>Crónica</h2>
            </div>

            {cargando && (
                <p
                    className="cronica-estado-carga"
                    role="status"
                    aria-live="polite"
                >
                    Cargando crónica...
                </p>
            )}

            {error && (
                <p className="cronica-estado-error" role="alert">
                    {error}
                </p>
            )}

            <section className="valores-caja cronica-lista">
                {!cargando && eventos.length === 0 ? (
                    <p>No hay eventos registrados.</p>
                ) : (
                    eventos.map((evento, index) => (
                        <p key={`${evento.turno}-${index}`}>
                            Turno {evento.turno}: {evento.descripcion}
                        </p>
                    ))
                )}
            </section>
        </div>
    );
}

export default Cronica;

