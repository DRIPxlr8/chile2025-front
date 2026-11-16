import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import {
    registrarUsuario as registrarUsuarioAPI,
    iniciarSesion as iniciarSesionAPI,
} from "../services/api";

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    async function manejarRegistro(nuevoUsuario) {
        await registrarUsuarioAPI(nuevoUsuario);
        setMostrarRegistro(false);
    }

    async function manejarLogin(credenciales) {
        const usuario = await iniciarSesionAPI(credenciales);

        onLogin(usuario);
        navigate("/partidas");
    }

    return (
        <section className="login-page">
            <div className="login-contenedor">
                <p className="etiqueta">Scopper</p>

                <h1>
                    {mostrarRegistro
                        ? "Crear una cuenta"
                        : "Iniciar sesión"}
                </h1>

                <p className="login-descripcion">
                    {mostrarRegistro
                        ? "Crea tu cuenta y comienza tu aventura."
                        : "Ingresa a tu cuenta para continuar tu partida."}
                </p>

                {mostrarRegistro ? (
                    <RegisterForm
                        onRegister={manejarRegistro}
                        cambiarFormulario={() => setMostrarRegistro(false)}
                    />
                ) : (
                    <LoginForm
                        onLogin={manejarLogin}
                        cambiarFormulario={() => setMostrarRegistro(true)}
                    />
                )}
            </div>
        </section>
    );
}

export default Login;