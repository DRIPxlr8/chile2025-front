const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000/api");

async function solicitar(ruta, opciones = {}) {
    let respuesta;
    let sesionEnviada = null;

    try {
        const metodo = opciones.method || "GET";
        const esPublica =
            (metodo === "GET" && ruta === "/disponible") ||
            (metodo === "POST" && (ruta === "/auth/login" || ruta === "/usuarios"));

        const headers = {
            "Content-Type": "application/json",
            ...opciones.headers,
        };

        if (!esPublica) {
            sesionEnviada = sessionStorage.getItem("scopper_usuario")
            const sesion = JSON.parse(sesionEnviada || "null");

            if (sesion?.token) {
                headers.Authorization = `Bearer ${sesion.token}`;
            }
        }

        respuesta = await fetch(`${API_URL}${ruta}`, {
            ...opciones,
            headers,
        });
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error("La sesión guardada no tiene un formato válido", { cause: error });
        }

        if (error instanceof TypeError) {
            throw new Error(
                "No se pudo conectar con el servidor. Verifica que el backend esté funcionando", { cause: error });
        }

        throw error;
    }

    const datos = respuesta.status === 204
        ? null
        : await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
        if (
            respuesta.status === 401 &&
            sesionEnviada &&
            sessionStorage.getItem("scopper_usuario") === sesionEnviada
        ) {
            window.dispatchEvent(new Event("scopper:sesion-invalida"));
        }

        const mensaje =
            datos?.mensaje ||
            datos?.error ||
            `Error HTTP ${respuesta.status}`;

        const error = new Error(mensaje);
        error.status = respuesta.status;
        error.data = datos;

        throw error;
    }

    return datos;
}

function enviarJSON(ruta, metodo, datos) {
    return solicitar(ruta, {
        method: metodo,
        body: JSON.stringify(datos),
    });
}

// Disponibilidad del backend

export function verificarDisponibilidad() {
    return solicitar("/disponible");
}

// Usuarios

export function registrarUsuario(datos) {
    return enviarJSON("/usuarios", "POST", datos);
}

export function iniciarSesion(datos) {
    return enviarJSON("/auth/login", "POST", datos);
}

export function listarUsuarios() {
    return solicitar("/usuarios");
}

export function obtenerUsuario(usuarioId) {
    return solicitar(`/usuarios/${encodeURIComponent(usuarioId)}`);
}

export function actualizarUsuario(usuarioId, datos) {
    return enviarJSON(
        `/usuarios/${encodeURIComponent(usuarioId)}`,
        "PATCH",
        datos
    );
}

export function eliminarUsuario(usuarioId) {
    return solicitar(
        `/usuarios/${encodeURIComponent(usuarioId)}`,
        { method: "DELETE" }
    );
}

// Partidas

export function listarPartidas(estado = "en_espera") {
    const query = estado ? `?estado=${encodeURIComponent(estado)}` : "";
    return solicitar(`/partidas${query}`);
}

export function crearPartida({ nombre_partida }) {
    return enviarJSON("/partidas", "POST", { nombre_partida });
}

export function obtenerPartida(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}`);
}

export function cancelarPartida(partidaId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}`,
        { method: "DELETE" }
    );
}

export function unirsePartida(partidaId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/jugadores`,
        { method: "POST" }
    );
}

export function consultarEstado(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}/estado`);
}

// Jugadores de una partida

export function consultarJugador(partidaId, jugadorId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/jugadores/${encodeURIComponent(jugadorId)}`
    );
}

// Casillas

export function listarCasillas(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}/casillas`);
}

export function consultarCasilla(partidaId, x, y) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/casillas/${encodeURIComponent(x)}/${encodeURIComponent(y)}`
    );
}

// Turnos y rendición

export function pasarTurno(partidaId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/turno`,
        { method: "PATCH" }
    );
}

export function rendirse(partidaId, confirmado) {
    return enviarJSON(
        `/partidas/${encodeURIComponent(partidaId)}/rendicion`,
        "POST",
        { confirmado }
    );
}

// Crónica

export function consultarCronica(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}/cronica`);
}

// Unidades

export function listarUnidades(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}/unidades`);
}

export function obtenerUnidad(partidaId, unidadId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/unidades/${encodeURIComponent(unidadId)}`
    );
}

export function reclutarUnidad(partidaId, casillaDestino, tipoUnidad) {
    return enviarJSON(
        `/partidas/${encodeURIComponent(partidaId)}/unidades`,
        "POST",
        { tipo_unidad: tipoUnidad, casilla_destino: casillaDestino }
    );
}

export function moverUnidad(partidaId, unidadId, casillaDestino) {
    return enviarJSON(
        `/partidas/${encodeURIComponent(partidaId)}/unidades/${encodeURIComponent(unidadId)}`,
        "PATCH",
        { casilla_destino: casillaDestino }
    );
}

// Mejoras

export function listarTiposMejora() {
    return solicitar("/tipos-mejora");
}

export function listarMejoras(partidaId) {
    return solicitar(`/partidas/${encodeURIComponent(partidaId)}/mejoras`);
}

export function comprarMejora(partidaId, tipoMejora) {
    return enviarJSON(
        `/partidas/${encodeURIComponent(partidaId)}/mejoras`,
        "POST",
        { tipo_mejora: tipoMejora }
    );
}

export function equiparMejora(partidaId, unidadId, mejoraId) {
    return solicitar(
        `/partidas/${encodeURIComponent(partidaId)}/unidades/${encodeURIComponent(unidadId)}/mejoras/${encodeURIComponent(mejoraId)}`,
        { method: "PUT" }
    );
}