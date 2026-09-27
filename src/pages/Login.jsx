import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import mockUsuarios from "../mocks/mockUsuarios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const navigate = useNavigate();
    
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const [usuarios, setUsuarios] = useState(mockUsuarios);

    function registrarUsuario(nuevoUsuario) {
        setUsuarios([...usuarios, nuevoUsuario]);
        setMostrarRegistro(false);
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
                        usuarios={usuarios} // lista de usuarios para validar si el nombre de usuario o correo ya están en uso
                        onRegister={registrarUsuario}
                        cambiarFormulario={() => setMostrarRegistro(false)}
                    />
                ) : (
                    
                    <LoginForm
                        usuarios={usuarios}
                        onLogin={(usuario) => {
                        onLogin(usuario);
                        navigate("/juego");
                        }}
                        cambiarFormulario={() => setMostrarRegistro(true)}
                    />
                )}
            </div>
        </section>
    );
}

export default Login;