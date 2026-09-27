import mockPartida from "../mocks/mockPartida";
import "../styles/Panel.css";
import "../styles/Cronica.css";

function Cronica() {
    const cronica = mockPartida.cronica;
    return (
        <div className="cuadro">
            <div className="cronica-encabezado">
                <h2>Crónica</h2>
            </div>
            <section className="valores-caja cronica-lista">
                {cronica.map((evento, index) => (
                    <p key={index}>Turno {evento.turno}: {evento.descripcion}</p>
                ))}
            </section>
        </div>
    );
}

export default Cronica;