import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook para redirección
import '../Login/Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [mensajeError, setMensajeError] = useState('');
  const navigate = useNavigate(); // Hook para redirección

  // Validación y envío de formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    // Validación de correo electrónico
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errores.email = 'Correo electrónico inválido';
      valid = false;
    }

    // Validación de contraseña
    if (!password) {
      errores.password = 'La contraseña es obligatoria';
      valid = false;
    }

    setErrores(errores);

    if (valid) {
      // Aquí puedes agregar la lógica para verificar las credenciales del usuario.
      // Si el inicio de sesión es exitoso, redirigimos al usuario.
      if (email === 'usuario@qgrade.com' && password === 'password123') {
        // Redirigir al usuario a la pantalla de inicio
        navigate('/dashboard'); // Cambia '/dashboard' por la ruta a la que quieres redirigir
      } else {
        setMensajeError('Credenciales inválidas');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
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
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
          <p><a href="/recover-password">Olvidaste tu contraseña</a></p>
        </div>
      </form>
    </div>
  );
};

export default Login;
