import '../styles/Nosotros.css';

function Nosotros() {
    return (
        <>
            <section className="centrado">
                <p className="etiqueta">Equipo</p>
                <h1>Quienes somos</h1>
                <p>
                    Somos un grupo de estudiantes de Ingeniería Civil Industrial de la
                    Pontificia Universidad Católica de Chile. Scopper nació como
                    proyecto del curso IIC2513 Tecnologías y Aplicaciones Web, donde
                    diseñamos y construimos un juego de estrategia por turnos desde
                    cero.
                </p>
            </section>

            <section className="equipo">
                <article className="integrante">
                    <h2>Maximiliano</h2>
                    <h2>Santibáñez</h2>
                    <p>Ingeniería Civil Industrial UC</p>
                </article>
                <article className="integrante">
                    <h2>Vicente</h2>
                    <h2>San Juan</h2>
                    <p>Ingeniería Civil Industrial UC</p>
                </article>
                <article className="integrante">
                    <h2>Tomás</h2>
                    <h2>Vergara</h2>
                    <p>Ingeniería Civil Industrial UC</p>
                </article>
            </section>
        </>
    )
}

export default Nosotros;