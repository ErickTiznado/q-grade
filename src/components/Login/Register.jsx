import React, { useState } from 'react';
import '../Login/Register.css';
import { Logo } from '../UI/Logo';



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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    if (!nombres) errores.nombres = 'El nombre es obligatorio';
    if (!apellidos) errores.apellidos = 'El apellido es obligatorio';
    if (!email || !/\S+@\S+\.\S+/.test(email)) errores.email = 'Correo electrónico inválido';
    if (!password || password.length < 8) errores.password = 'La contraseña debe tener al menos 8 caracteres';
    if (password !== confirmPassword) errores.confirmPassword = 'Las contraseñas no coinciden';
    if (!terminos) errores.terminos = 'Debes aceptar los términos y condiciones';

    setErrores(errores);

    if (Object.keys(errores).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombres, apellidos, email, password, perfil }),
        });

        const data = await response.json();
        if (response.ok) {
          setMensajeExito('¡Registro exitoso! Ahora puedes iniciar sesión.');
          setNombres('');
          setApellidos('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setPerfil('Estudiante');
          setTerminos(false);
        } else {
          alert(data.message); // Muestra mensaje de error del servidor
        }
      } catch (error) {
        console.error('Error al registrar usuario:', error);
      }
    }
  };

  return (
  <main className='container'>
    <Logo className={'logo'}/>
    <div className="register-container">
      <h2 className='register-title' >Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label  className='register-label'  htmlFor="nombres">Nombre Completo</label>
          <input type="text" id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
          {errores.nombres && <span className="error">{errores.nombres}</span>}
        </div>

        <div className="form-group">
          <label  className='register-label' htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errores.email && <span className="error">{errores.email}</span>}
        </div>

        <div className="form-group">
          <label  className='register-label' htmlFor="password">Contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errores.password && <span className="error">{errores.password}</span>}
        </div>

        <div className="form-group">
          <label  className='register-label' htmlFor="confirmPassword">Confirmación de contraseña</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {errores.confirmPassword && <span className="error">{errores.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label className='register-label' >¿Eres?</label>
          <div className="radio-group">
            <label className='register-label' >
              <input type="radio" name="perfil" value="Estudiante" checked={perfil === 'Estudiante'} onChange={(e) => setPerfil(e.target.value)} />
              Estudiante
            </label>
            <label className='register-label' >
              <input type="radio" name="perfil" value="Otro" checked={perfil === 'Otro'} onChange={(e) => setPerfil(e.target.value)} />
              Otro
            </label>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="terminos" checked={terminos} onChange={() => setTerminos(!terminos)} />
          <label  className='register-label' htmlFor="terminos">
            Acepto los <a href="/terminos" style={{ color: 'blue', textDecoration: 'none' }}>términos y condiciones</a>
          </label>
          {errores.terminos && <span className="error">{errores.terminos}</span>}
        </div>

        <button className='register-submit' type="submit">Registrarse</button>
      </form>

      {mensajeExito && <p className="success-message">{mensajeExito}</p>}

      <p className='login-Link'>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aqui.</a></p>
    </div>
    </main>
  );
};

export default Register;
