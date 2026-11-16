
import { useState } from "react";
import "../styles/LoginForm.css";

function LoginForm({ onLogin, cambiarFormulario }) {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);

    function validarFormulario() {
        const nuevosErrores = {};
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!formatoCorreo.test(correo.trim())) {
            nuevosErrores.correo = "Ingresa un correo válido";
        }

        if (!contraseña) {
            nuevosErrores.contraseña = "La contraseña es obligatoria";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    }

    async function manejarSubmit(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        setErrores({});
        setCargando(true);

        try {
            await onLogin({
                correo: correo.trim().toLowerCase(),
                contrasena: contraseña,
            });
        } catch (error) {
            setErrores({
                formulario:
                    error.message || "No se pudo iniciar sesión.",
            });
        } finally {
            setCargando(false);
        }
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
                    <p className="mensaje-error">
                        {errores.contraseña}
                    </p>
                )}
            </div>

            {errores.formulario && (
                <p className="mensaje-error">{errores.formulario}</p>
            )}

            <button type="submit" disabled={cargando}>
                {cargando ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <p className="cambiar-formulario">
                ¿No tienes una cuenta?{" "}
                <button type="button" onClick={cambiarFormulario}>
                    Registrarse
                </button>
            </p>
        </form>
    );
}

export default LoginForm;
