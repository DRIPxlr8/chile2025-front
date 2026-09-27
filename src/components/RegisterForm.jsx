import { useState } from "react";
import "../styles/RegisterForm.css";

function RegisterForm({ onRegister, cambiarFormulario, usuarios }) {   // se guarda lo que el usuario escribió en los campos del formulario de registro y se manejan los errores de validación
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmarContraseña, setConfirmarContraseña] = useState("");
    const [errores, setErrores] = useState({});
    const [rol, setRol] = useState("");
    const [codigoAdmin, setCodigoAdmin] = useState("");

    function validarFormulario() {
        const nuevosErrores = {};

        if (!nombreUsuario) {
            nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio";
        } else if (!/^[a-zA-Z0-9_]+$/.test(nombreUsuario)) {
            nuevosErrores.nombreUsuario =
              "El nombre de usuario solo puede contener letras, números y _";
        } else if (usuarios.some((usuario) => usuario.nombre_usuario === nombreUsuario)) { //se verifica si el nombre de usuario ya está en uso por otro usuario
            nuevosErrores.nombreUsuario = "El nombre de usuario ya está en uso";
        }
       
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!formatoCorreo.test(correo)) {
            nuevosErrores.correo = "Ingresa un correo válido";
        } else if (usuarios.some((usuario) => usuario.correo === correo)) { //se verifica si el correo ya está en uso por otro usuario
            nuevosErrores.correo = "El correo ya está en uso";
        }

        if (!contraseña) {
            nuevosErrores.contraseña = "La contraseña es obligatoria";
        } else if (contraseña.length < 6) {
            nuevosErrores.contraseña = "La contraseña debe tener al menos 6 caracteres";
        } else if (contraseña.length > 15) {
            nuevosErrores.contraseña = "La contraseña no debe tener más de 15 caracteres";
        }

        if (!confirmarContraseña) {
            nuevosErrores.confirmarContraseña =
                "Debes confirmar tu contraseña";
        } else if (contraseña !== confirmarContraseña) {
            nuevosErrores.confirmarContraseña =
                "Las contraseñas no coinciden";
        }

        if (!rol) {
            nuevosErrores.rol = "Debes seleccionar un rol"; // se valida que el usuario haya seleccionado un rol y no quede "Selecciona un rol" como valor por defecto
        } else if (rol === "Administrador") {
            if (!codigoAdmin) {
                nuevosErrores.codigoAdmin = "Debes ingresar el código de administrador";
            } else if (codigoAdmin !== import.meta.env.VITE_CODIGO_ADMIN) { // se valida que código ingresado sea correcto según definido en el .env
                nuevosErrores.codigoAdmin = "El código de administrador es incorrecto";
            }
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;  // deben existir 0 errores para que el formulario sea válido
    }

    function manejarSubmit(e) {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }
        const nuevoUsuario = {
            usuario_id: Date.now(),
            nombre_usuario: nombreUsuario,
            correo: correo,
            contraseña: contraseña,
            rol: rol
        };
        onRegister(nuevoUsuario);
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

            <button type="submit">Crear cuenta</button>

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