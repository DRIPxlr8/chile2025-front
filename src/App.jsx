import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Instrucciones from "./pages/Instrucciones";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Tablero from "./pages/Tablero";
import RutaProtegida from "./components/RutaProtegida";
import Partidas from "./pages/Partidas";
import { obtenerUsuario } from "./services/api";

const CLAVE_SESION = "scopper_usuario";

function recuperarUsuario() {
    try {
        localStorage.removeItem(CLAVE_SESION);

        const datosGuardados = sessionStorage.getItem(CLAVE_SESION);

        if (!datosGuardados) {
            return null;
        }

        const usuario = JSON.parse(datosGuardados);

        if (
            usuario?.usuario_id == null ||
            !usuario?.nombre_usuario ||
            !usuario?.rol ||
            !usuario?.token
        ) {
            sessionStorage.removeItem(CLAVE_SESION);
            return null;
        }

        return {
            usuario_id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol,
            token: usuario.token,
        };
    } catch {
        sessionStorage.removeItem(CLAVE_SESION);
        return null;
    }
}

function App() {
    const [usuarioActivo, setUsuarioActivo] = useState(recuperarUsuario);
    const usuarioId = usuarioActivo?.usuario_id;

    function iniciarSesion(usuario) {
        if (
            usuario?.usuario_id == null ||
            !usuario?.nombre_usuario ||
            !usuario?.rol ||
            !usuario?.token
        ) {
            throw new Error(
                "El servidor no devolvió los datos esperados del usuario."
            );
        }

        const datosSesion = {
            usuario_id: usuario.usuario_id,
            nombre_usuario: usuario.nombre_usuario,
            rol: usuario.rol,
            token: usuario.token,
        };

        sessionStorage.setItem(CLAVE_SESION, JSON.stringify(datosSesion));
        setUsuarioActivo(datosSesion);
    }

    const cerrarSesion = useCallback(() => {
        sessionStorage.removeItem(CLAVE_SESION);
        localStorage.removeItem(CLAVE_SESION);
        setUsuarioActivo(null);
    }, []);

    useEffect(() => {
        if (usuarioId == null) {
            return;
        }

        window.addEventListener("scopper:sesion-invalida", cerrarSesion);

        obtenerUsuario(usuarioId).catch((error) => {
            if (error.status !== 401) {
                console.error("No se pudo comprobar la sesión", error);
            }
        });

        return () => {
            window.removeEventListener("scopper:sesion-invalida", cerrarSesion);
        };
    }, [usuarioId, cerrarSesion]);

    return (
        <>
            <header>
                <Navbar
                    usuarioActivo={usuarioActivo}
                    cerrarSesion={cerrarSesion}
                />
            </header>

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={<Landing usuarioActivo={usuarioActivo} />}
                    />
                    <Route path="/instrucciones" element={<Instrucciones />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route
                        path="/login"
                        element={<Login onLogin={iniciarSesion} />}
                    />
                    <Route
                        path="/partidas"
                        element={
                            <RutaProtegida usuarioActivo={usuarioActivo}>
                                <Partidas usuarioActivo={usuarioActivo} />
                            </RutaProtegida>
                        }
                    />
                    <Route
                        path="/juego"
                        element={
                            <RutaProtegida usuarioActivo={usuarioActivo}>
                                <Tablero usuarioActivo={usuarioActivo} />
                            </RutaProtegida>
                        }
                    />
                </Routes>
            </main>

            <footer>
                <p>Scopper — Crónicas del Reino</p>
                <p>Un juego de estrategia, conquista y gloria.</p>
                <p>© 2026 Scopper</p>
            </footer>
        </>
    );
}

export default App;