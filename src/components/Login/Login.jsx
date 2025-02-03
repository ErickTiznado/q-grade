import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import {Logo} from '../UI/Logo'



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
  <main className="container">
    <Logo className={'Logo'}/>
    <div className="login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Correo electrónico</label>
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
          <label className="form-label" htmlFor="password">Contraseña</label>
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

        <button className='login-submit' type="submit">Iniciar sesión</button>

        {mensajeError && <p className="error-message">{mensajeError}</p>}
      </form>
      <div className="links">
          <p className="login-links">
            ¿No tienes cuenta?{" "}
            <a className="link-registrar" href="/register">
              Regístrate aquí
            </a>
          </p>
          <p className="login-links">
            ¿Olvidaste tu contraseña?{" "}
            <a className="link-recuperar" href="/recuperar">
              Recupérala aquí
            </a>
          </p>
        </div>
    </div>
    </main>
  );
};

export default Login;