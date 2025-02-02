import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errores.email = "Correo electrónico inválido";
      valid = false;
    }

    if (!password) {
      errores.password = "La contraseña es obligatoria";
      valid = false;
    }

    setErrores(errores);

    if (valid) {
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          navigate("/dashboard"); // Redirigir a la pantalla deseada
        } else {
          setMensajeError(data.message);
        }
      } catch (error) {
        setMensajeError("Error en el servidor. Inténtalo más tarde.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
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
          {errores.email && <span className="error">{errores.email}</span>}
        </div>

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
          {errores.password && <span className="error">{errores.password}</span>}
        </div>

        <button type="submit">Iniciar sesión</button>

        {mensajeError && <p className="error-message">{mensajeError}</p>}

        <div className="links">
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/register" style={{ color: "green", textDecoration: "none" }}>
              Regístrate aquí
            </a>
          </p>
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <a href="/recuperar" style={{ color: "blue", textDecoration: "none" }}>
              Recupérala aquí
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
