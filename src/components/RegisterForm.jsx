import { useState } from "react";
import "../styles/RegisterForm.css";

function RegisterForm({ onRegister, cambiarFormulario }) {   // se guarda lo que el usuario escribió en los campos del formulario de registro y se manejan los errores de validación
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [errores, setErrores] = useState({});
    const [rol, setRol] = useState("");
    const [codigoAdmin, setCodigoAdmin] = useState("");
    const [cargando, setCargando] = useState(false);
    
    function validarFormulario() {
        const nuevosErrores = {};
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const nombre = nombreUsuario.trim();

        if (!nombre) {
            nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
        } else if (nombre.length < 3 || nombre.length > 50) {
            nuevosErrores.nombreUsuario = "El nombre de usuario debe tener entre 3 y 50 caracteres";
        } else if (!/^[a-zA-Z0-9_]+$/.test(nombre)) {
            nuevosErrores.nombreUsuario = "El nombre de usuario solo puede contener letras, números y _";
        }

        if (!correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!formatoCorreo.test(correo.trim())) {
            nuevosErrores.correo = "Ingresa un correo válido";
        }

        if (!contraseña) {
            nuevosErrores.contraseña = "La contraseña es obligatoria";
        } else if (contraseña.length < 6) {
            nuevosErrores.contraseña =
                "La contraseña debe tener al menos 6 caracteres";
        } else if (new TextEncoder().encode(contraseña).length > 72) {
            nuevosErrores.contraseña =
                "La contraseña no puede superar los 72 bytes";
        }

        if (!confirmarContraseña) {
            nuevosErrores.confirmarContraseña =
                "Debes confirmar tu contraseña";
        } else if (contraseña !== confirmarContraseña) {
            nuevosErrores.confirmarContraseña =
                "Las contraseñas no coinciden";
        }

        if (!rol) {
            nuevosErrores.rol = "Debes seleccionar un rol";
        } else if (rol === "Administrador" && !codigoAdmin.trim()) {
            nuevosErrores.codigoAdmin =
                "Debes ingresar el código de administrador";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    }

    async function manejarSubmit(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        const nuevoUsuario = {
            nombre_usuario: nombreUsuario.trim(),
            correo: correo.trim().toLowerCase(),
            contrasena: contraseña,
            avatar: null,
            rol: rol,
        };

        if (rol === "Administrador") {
            nuevoUsuario.codigo_admin = codigoAdmin;
        }

        setErrores({});
        setCargando(true);

        try {
            await onRegister(nuevoUsuario);
        } catch (error) {
            if (error.status === 403 && rol === "Administrador") {
                setErrores({
                    codigoAdmin: error.message,
                });
            } else {
                setErrores({
                    formulario:
                        error.message || "No se pudo registrar la cuenta.",
                });
            }
        } finally {
            setCargando(false);
        }
    }

    return (
        <form className="register-form" onSubmit={manejarSubmit}>
            <div className="form-campo">
                <label htmlFor="nombreUsuario">Nombre de usuario</label>
                <input
                    id="nombreUsuario"
                    type="text"
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    className={errores.nombreUsuario ? "campo-error" : ""}
                    placeholder="Ingresa tu nombre de usuario"
                />
                {errores.nombreUsuario && (
                    <p className="mensaje-error">
                        {errores.nombreUsuario}
                    </p>
                )}
            </div>

            <div className="form-campo">
                <label htmlFor="registroCorreo">Correo electrónico</label>
                <input
                    id="registroCorreo"
                    type="text"
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
                <label htmlFor="registroContraseña">Contraseña</label>
                <input
                    id="registroContraseña"
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

            <div className="form-campo">
                <label htmlFor="confirmarContraseña">
                    Confirmar contraseña
                </label>
                <input
                    id="confirmarContraseña"
                    type="password"
                    value={confirmarContraseña}
                    onChange={(e) =>
                        setConfirmarContraseña(e.target.value)
                    }
                    className={errores.confirmarContraseña ? "campo-error" : ""}
                    placeholder="Repite tu contraseña"
                />
                {errores.confirmarContraseña && (
                    <p className="mensaje-error">
                        {errores.confirmarContraseña}
                    </p>
                )}
            </div>

            <div className="form-campo">
                <label htmlFor="rol">Rol</label> {/* se agrega el campo para que el usuario seleccione su rol, ya sea Jugador o Administrador */}
                <select
                    id="rol"
                    value={rol}
                    onChange={(event) => setRol(event.target.value)}
                    className={errores.rol ? "campo-error" : ""}
                >
                    <option value="">Selecciona un rol</option> {/*se establece con value vacio para que seleccionar un rol no sea puesto como rol*/}
                    <option value="Jugador">Jugador</option>
                    <option value="Administrador">Administrador</option>
                </select>

                {errores.rol && (
                    <p className="mensaje-error">{errores.rol}</p>
                )}
            </div>

            {rol === "Administrador" && (
                <div className="form-campo">
                    <label htmlFor="codigoAdmin">Código de administrador</label> {/* campo para ingresar el código de administrador */}
                    <input
                        id="codigoAdmin"
                        type="password"
                        value={codigoAdmin}
                        onChange={(e) => setCodigoAdmin(e.target.value)}
                        className={errores.codigoAdmin ? "campo-error" : ""}
                        placeholder="Código de seguridad"
                    />
                    {errores.codigoAdmin && ( <p className="mensaje-error"> {errores.codigoAdmin}</p>
                    )}
                </div>
            )}

            {errores.formulario && (
                <p className="mensaje-error">{errores.formulario}</p>
            )}

            <button type="submit" disabled={cargando}>
                {cargando ? "Creando cuenta..." : "Crear cuenta"}
            </button>

            <p className="cambiar-formulario">
                ¿Ya tienes una cuenta?{" "}
                <button
                    type="button"
                    onClick={cambiarFormulario}
                >
                    Iniciar sesión
                </button>
            </p>
        </form>
    );
}

export default RegisterForm;