import React, { useState } from 'react';
import '../Login/Register.css';

const Register = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [perfil, setPerfil] = useState('Estudiante');
  const [terminos, setTerminos] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    if (!nombres) {
      errores.nombres = 'El nombre es obligatorio';
      valid = false;
    }

    if (!apellidos) {
      errores.apellidos = 'El apellido es obligatorio';
      valid = false;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errores.email = 'Correo electrónico inválido';
      valid = false;
    }

    if (!password || password.length < 8) {
      errores.password = 'La contraseña debe tener al menos 8 caracteres';
      valid = false;
    }

    if (password !== confirmPassword) {
      errores.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    if (!terminos) {
      errores.terminos = 'Debes aceptar los términos y condiciones';
      valid = false;
    }

    setErrores(errores);

    if (valid) {
      setMensajeExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
    }
  };

  return (
    <div className="register-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombres">Nombres</label>
          <input
            type="text"
            id="nombres"
            placeholder="Escribe tu nombre completo"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            required
          />
          {errores.nombres && <span className="error">{errores.nombres}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="apellidos">Apellidos</label>
          <input
            type="text"
            id="apellidos"
            placeholder="Escribe tus apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
          {errores.apellidos && <span className="error">{errores.apellidos}</span>}
        </div>

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
            placeholder="Escribe una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errores.password && <span className="error">{errores.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmación de contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errores.confirmPassword && <span className="error">{errores.confirmPassword}</span>}
        </div>

        {/* Botones de opción (radio buttons) para Perfil (en columna) */}
        <div className="form-group">
          <label>Perfil</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="perfil"
                value="Estudiante"
                checked={perfil === 'Estudiante'}
                onChange={(e) => setPerfil(e.target.value)}
              />
              Estudiante
            </label>

            <label>
              <input
                type="radio"
                name="perfil"
                value="Otro"
                checked={perfil === 'Otro'}
                onChange={(e) => setPerfil(e.target.value)}
              />
              Otro
            </label>
          </div>
        </div>

        {/* Checkbox para aceptar términos y condiciones */}
        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="terminos"
            checked={terminos}
            onChange={() => setTerminos(!terminos)}
          />
          <label htmlFor="terminos">
            Acepto los <a href="/terminos" style={{ color: 'blue', textDecoration: 'none' }}>términos y condiciones</a>
          </label>
          {errores.terminos && <span className="error">{errores.terminos}</span>}
        </div>

        <button
          type="submit"
          disabled={
            !nombres ||
            !apellidos ||
            !email ||
            !password ||
            !confirmPassword ||
            !terminos ||
            password !== confirmPassword
          }
        >
          Registrarse
        </button>
      </form>

      {mensajeExito && <p className="success-message">{mensajeExito}</p>}

      <p>
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
};

export default Register;
