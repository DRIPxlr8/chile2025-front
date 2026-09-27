import { Navigate } from "react-router-dom"; //se usa Navigate para redirigir a la página de login si el usuario no tiene sesión iniciada

function RutaProtegida({ usuarioActivo, children }) { // children es el componente que se renderiza si el usuario tiene sesión iniciada, en este caso es el componente Tablero
    if (!usuarioActivo) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default RutaProtegida;