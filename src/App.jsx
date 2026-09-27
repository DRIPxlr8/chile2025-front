import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Instrucciones from "./pages/Instrucciones";
import Nosotros from "./pages/Nosotros";
import Login from "./pages/Login";
import Tablero from "./pages/Tablero";
import RutaProtegida from "./components/RutaProtegida"; // para evitar que usuarios no logueados accedan a la página del juego

function App() {  // manejo de rutas y navegación entre las diferentes páginas de la aplicación
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  function cerrarSesion() {
    setUsuarioActivo(null);
  }

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
          <Route path="/" element={<Landing usuarioActivo={usuarioActivo} />} />
          <Route path="/instrucciones" element={<Instrucciones />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route
            path="/login"
            element={<Login onLogin={setUsuarioActivo} />}
          />
          <Route path="/juego" element={ <RutaProtegida usuarioActivo={usuarioActivo}> <Tablero /> </RutaProtegida> } /> {/* la ruta del juego está protegida y solo es accesible si el usuario tiene sesión iniciada */}
        </Routes>
      </main>

      <footer> {/* pie de página de la aplicación con información sobre el juego y derechos de autor */}
        <p>Scopper — Crónicas del Reino</p>
        <p>Un juego de estrategia, conquista y gloria.</p>
        <p>© 2026 Scopper</p>
      </footer>
    </>
  );
}

export default App;