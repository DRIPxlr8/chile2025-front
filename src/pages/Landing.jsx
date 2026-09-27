import { Link } from 'react-router-dom';
import '../styles/Landing.css';

function Landing({ usuarioActivo }) {
    const destino = usuarioActivo ? "/juego" : "/login";  //usuario con sesión iniciada va a la página del juego, de lo contrario va a la página de login

    return (
        <>
            <section className="centrado">
                <div className="landing-texto">
                    <p className="etiqueta">Juego de estrategia medieval</p>
                    <h1>
                        El reino <span>te espera</span>
                    </h1>
                    <p>
                        Alza tu estandarte, reúne a tus guerreros y conquista el
                        territorio. En Scopper, cada movimiento puede convertirte en
                        señor del reino... o en una leyenda olvidada.
                    </p>
                    <Link to={destino} className="boton">Jugar</Link>
                </div>
            </section>

            <section className="centrado">
                <p className="etiqueta">Las crónicas</p>
                <h2>El destino se escribe en cada turno</h2>
                <p>Reúne tus fuerzas, administra tus riquezas y conquista las tierras de tu rival.</p>

                <div className="pasos">
                    <article className="paso">
                        <span className="paso-numero">I</span>
                        <h3>Conquista</h3>
                        <p>Avanza por el tablero y reclama nuevas tierras para tu reino.</p>
                    </article>
                    <article className="paso">
                        <span className="paso-numero">II</span>
                        <h3>Recauda oro</h3>
                        <p>Cada territorio conquistado fortalece tus arcas al final del turno.</p>
                    </article>
                    <article className="paso">
                        <span className="paso-numero">III</span>
                        <h3>Equipa</h3>
                        <p>Invierte tus riquezas en acero, hierro y mejoras para tu ejército.</p>
                    </article>
                    <article className="paso">
                        <span className="paso-numero">IV</span>
                        <h3>Domina</h3>
                        <p>Alcanza el 60% del territorio y proclámate soberano del reino.</p>
                    </article>
                </div>
            </section>

            <section className="centrado">
                <p className="etiqueta">El Ejército</p>
                <h2>Escoge sabiamente a tus guerreros</h2>
                <p>Cada clase posee una ventaja frente a otra. La victoria pertenece al comandante que sabe combinar sus fuerzas.</p>

                <div className="unidades">
                    <article className="unidad">
                        <p className="unidad-subtitulo">Guerrero de élite</p>
                        <h3>Caballero</h3>
                        <p>Guerrero protegido por acero. Su resistencia le permite dominar los enfrentamientos contra arqueros.</p>
                        <div className="unidad-estadisticas">
                            <div>
                                <span>Ataque</span>
                                <strong>III</strong>
                            </div>
                            <div>
                            <span>Defensa</span>
                            <strong>III</strong>
                            </div>
                        </div>
                        <p className="unidad-ventaja">Fuerte contra: <strong>Arquero</strong></p>
                    </article>

                    <article className="unidad">
                        <p className="unidad-subtitulo">Guardián del bosque</p>
                        <h3>Arquero</h3>
                        <p>Maestro de la distancia. Sus flechas son especialmente efectivas contra los frágiles magos.</p>
                        <div className="unidad-estadisticas">
                            <div>
                                <span>Ataque</span>
                                <strong>III</strong>
                            </div>
                            <div>
                            <span>Defensa</span>
                            <strong>II</strong>
                            </div>
                        </div>
                        <p className="unidad-ventaja">Fuerte contra: <strong>Mago</strong></p>
                    </article>

                    <article className="unidad">
                        <p className="unidad-subtitulo">Portador de la magia</p>
                        <h3>Mago</h3>
                        <p>Guardián de las artes arcanas. Puede generar oro adicional para acelerar el crecimiento del reino.</p>
                        <div className="unidad-estadisticas">
                            <div>
                                <span>Ataque</span>
                                <strong>II</strong>
                            </div>
                            <div>
                            <span>Defensa</span>
                            <strong>II</strong>
                            </div>
                        </div>
                        <p className="unidad-ventaja">Fuerte contra: <strong>Caballero</strong></p>
                    </article>
                </div>
            </section>

            <section className="landing-final">
                <p className="etiqueta">El reino te espera</p>
                <h2>Alza tu estandarte</h2>
                <p>Crea tu cuenta y comienza a escribir tu propia leyenda.</p>
                <Link to={destino} className="boton">{usuarioActivo ? "Ir a jugar" : "Crear mi estandarte"}</Link> {/* el texto del botón cambia según si el usuario tiene sesión iniciada o no */ }
            </section>
        </>
    );
}

export default Landing;