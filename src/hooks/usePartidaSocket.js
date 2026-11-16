
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Reutiliza la dirección del backend configurada para la API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const SOCKET_URL = new URL(API_URL).origin;

function usePartidaSocket({ token, partidaId, onActualizada }) {
    const callbackRef = useRef(onActualizada);

    // Mantiene actualizado el callback sin reconectar el socket
    useEffect(() => {
        callbackRef.current = onActualizada;
    }, [onActualizada]);

    useEffect(() => {
        // No se conecta si no hay sesión o partida activa
        if (!token || !partidaId) {
            return;
        }

        const socket = io(SOCKET_URL, {
            auth: { token },
            transports: ["websocket"],
        });

        // Se ejecuta al conectar y después de cada reconexión
        socket.on("connect", () => {
            socket.emit(
                "partida:suscribir",
                { partida_id: Number(partidaId) },
                (respuesta) => {
                    if (!respuesta?.ok) {
                        console.error(
                            "No se pudo suscribir a la partida:",
                            respuesta?.mensaje || "Error desconocido"
                        );
                        return;
                    }

                    // Recupera el estado actualizado mediante HTTP
                    callbackRef.current?.();
                }
            );
        });

        // El backend avisa cuando cambia la partida
        socket.on("partida:actualizada", (datos) => {
            if (String(datos?.partida_id) === String(partidaId)) {
                callbackRef.current?.();
            }
        });

        socket.on("connect_error", (error) => {
            console.error(
                "Error de conexión del socket:",
                error.data?.mensaje || error.message
            );
        });

        // Limpieza al desmontar, cambiar de partida o cerrar sesión
        return () => {
            socket.off();
            socket.disconnect();
        };
    }, [token, partidaId]);
}

export default usePartidaSocket;
