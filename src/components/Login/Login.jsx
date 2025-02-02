import React, { useState } from "react"; // Importa React y el hook useState
import { useNavigate } from "react-router-dom"; // Importa useNavigate para la navegación entre rutas
import "../Login/Login.css"; // Importa los estilos CSS para el componente Login

const Login = () => {
  // Definición de estados para manejar los valores del formulario y mensajes de error
  const [email, setEmail] = useState(""); // Estado para almacenar el email del usuario
  const [password, setPassword] = useState(""); // Estado para almacenar la contraseña del usuario
  const [errores, setErrores] = useState({}); // Estado para almacenar los mensajes de error del formulario
  const [mensajeError, setMensajeError] = useState(""); // Estado para almacenar errores de autenticación
  const navigate = useNavigate(); // Hook de React Router para redireccionar a otras páginas

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página al enviar el formulario
    let valid = true; // Variable para controlar la validez del formulario
    const errores = {}; // Objeto para almacenar errores de validación

    // Validación del email: Debe ser un formato correcto
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errores.email = "Correo electrónico inválido";
      valid = false;
    }

    // Validación de la contraseña: No debe estar vacía
    if (!password) {
      errores.password = "La contraseña es obligatoria";
      valid = false;
    }

    setErrores(errores); // Se actualizan los errores en el estado

    // Si todas las validaciones son correctas, se envía la solicitud al backend
    if (valid) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }), // Se envían los datos como JSON
        });

        const data = await response.json(); // Se obtiene la respuesta del servidor en formato JSON

        if (response.ok) {
          navigate("/dashboard"); // Si el login es exitoso, redirige al usuario al dashboard
        } else {
          setMensajeError(data.message); // Si hay un error, se muestra el mensaje del backend
        }
      } catch (error) {
        setMensajeError("Error en el servidor. Inténtalo más tarde."); // Manejo de error en caso de fallo del servidor
      }
    }
  };

  return (
    <div className="login-container"> {/* Contenedor principal del formulario */}
      <h2>Iniciar Sesión</h2> {/* Título del formulario */}
      <form onSubmit={handleSubmit}> {/* Formulario de inicio de sesión */}
        
        {/* Campo de entrada para el correo electrónico */}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="Escribe tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errores.email && <span className="error">{errores.email}</span>} {/* Muestra mensaje de error si hay problema con el email */}
        </div>

        {/* Campo de entrada para la contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Escribe tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errores.password && <span className="error">{errores.password}</span>} {/* Muestra mensaje de error si hay problema con la contraseña */}
        </div>

        <button type="submit">Iniciar sesión</button> {/* Botón de envío del formulario */}

        {mensajeError && <p className="error-message">{mensajeError}</p>} {/* Muestra mensajes de error generales */}

        {/* Enlaces para registrarse o recuperar contraseña */}
        <div className="links">
          <p>
            ¿No tienes cuenta? {" "}
            <a href="/register" style={{ color: "green", textDecoration: "none" }}>
              Regístrate aquí
            </a>
          </p>
          <p>
            ¿Olvidaste tu contraseña? {" "}
            <a href="/recuperar" style={{ color: "blue", textDecoration: "none" }}>
              Recupérala aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login; // Exporta el componente Login para ser utilizado en otras partes de la aplicación
