import { useState } from "react";
import "../styles/LoginForm.css";

function LoginForm({ usuarios, onLogin, cambiarFormulario }) {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [errores, setErrores] = useState({});

    function validarFormulario() {
        const nuevosErrores = {};

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!formatoCorreo.test(correo)) {
            nuevosErrores.correo = "Ingresa un correo válido";
        }
        
        if (!contraseña) {
            nuevosErrores.contraseña = "La contraseña es obligatoria";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    }

    function manejarSubmit(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }
        const usuario = usuarios.find(
            usuario =>
                usuario.correo === correo &&
                usuario.contraseña === contraseña
        );
        if (!usuario) {
            setErrores({
                formulario: "El correo o la contraseña son incorrectos"
            });
            return;
        }
        setErrores({});
        onLogin(usuario);
    }

    return (
        <form className="login-form" onSubmit={manejarSubmit}>
            <div className="form-campo">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className={errores.correo ? "campo-error" : ""}
                    placeholder="correo@ejemplo.com"
                />
                {errores.correo && (
                    <p className="mensaje-error">{errores.correo}</p>
                )}
            </div>

            <div className="form-campo">
                <label htmlFor="contraseña">Contraseña</label>
                <input
                    id="contraseña"
                    type="password"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    className={errores.contraseña ? "campo-error" : ""}
                    placeholder="Ingresa tu contraseña"
                />
                {errores.contraseña && (
                    <p className="mensaje-error">{errores.contraseña}</p>
                )}
            </div>

            {errores.formulario && (
                <p className="mensaje-error">{errores.formulario}</p>
            )}

            <button type="submit">Iniciar sesión</button>

            <p className="cambiar-formulario">
                ¿No tienes una cuenta?{" "}
                <button
                    type="button"
                    onClick={cambiarFormulario}
                >
                    Registrarse
                </button>
            </p>
        </form>
    );
}

export default LoginForm;