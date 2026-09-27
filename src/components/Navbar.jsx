import { Link } from "react-router-dom"; // se encarga de manejar la navegación entre las diferentes rutas de la aplicación
import "../styles/Navbar.css"; // importa el archivo CSS para aplicar estilos al componente Navbar

function Navbar({ usuarioActivo, cerrarSesion }) {
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        ⚔ SCOPPER
      </Link>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/instrucciones">Instrucciones</Link>
        <Link to="/nosotros">Nosotros</Link>
      </div>

      <div className="navbar-acciones">
        {usuarioActivo ? (
          <>
            <span className="usuario-navbar">
              {usuarioActivo.nombre_usuario}
            </span>

            <button type="button" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}

        <Link to="/juego" className="boton-jugar">
          Jugar
        </Link>
      </div>

    </nav>
  );
}

export default Navbar; // exporta el componente Navbar para que pueda ser utilizado en otros archivos