import React, { useState } from 'react'; // Importa React y el hook useState
import '../Login/Register.css'; // Importa los estilos CSS para el formulario de registro

const Register = () => {
  // Definición de estados para manejar el formulario de registro
  const [nombres, setNombres] = useState(''); // Estado para el nombre del usuario
  const [apellidos, setApellidos] = useState(''); // Estado para el apellido del usuario
  const [email, setEmail] = useState(''); // Estado para el email del usuario
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Estado para confirmar la contraseña
  const [perfil, setPerfil] = useState('Estudiante'); // Estado para el perfil del usuario (Estudiante/Otro)
  const [terminos, setTerminos] = useState(false); // Estado para la aceptación de términos y condiciones
  const [errores, setErrores] = useState({}); // Estado para almacenar mensajes de error en el formulario
  const [mensajeExito, setMensajeExito] = useState(''); // Estado para mensajes de éxito

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga de la página
    let valid = true;
    const errores = {};

    // Validaciones de los campos
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
    <div className="register-container"> {/* Contenedor del formulario de registro */}
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}> {/* Formulario de registro */}
        
        {/* Campo de entrada para nombres */}
        <div className="form-group">
          <label htmlFor="nombres">Nombres</label>
          <input type="text" id="nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
          {errores.nombres && <span className="error">{errores.nombres}</span>}
        </div>

        {/* Campo de entrada para apellidos */}
        <div className="form-group">
          <label htmlFor="apellidos">Apellidos</label>
          <input type="text" id="apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
          {errores.apellidos && <span className="error">{errores.apellidos}</span>}
        </div>

        {/* Campo de entrada para email */}
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {errores.email && <span className="error">{errores.email}</span>}
        </div>

        {/* Campo de entrada para contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {errores.password && <span className="error">{errores.password}</span>}
        </div>

        {/* Confirmación de contraseña */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmación de contraseña</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {errores.confirmPassword && <span className="error">{errores.confirmPassword}</span>}
        </div>

        {/* Selección de perfil */}
        <div className="form-group">
          <label>¿Eres?</label>
          <div className="radio-group">
            <label>
              <input type="radio" name="perfil" value="Estudiante" checked={perfil === 'Estudiante'} onChange={(e) => setPerfil(e.target.value)} />
              Estudiante
            </label>
            <label>
              <input type="radio" name="perfil" value="Otro" checked={perfil === 'Otro'} onChange={(e) => setPerfil(e.target.value)} />
              Otro
            </label>
          </div>
        </div>

        {/* Aceptación de términos y condiciones */}
        <div className="form-group checkbox-group">
          <input type="checkbox" id="terminos" checked={terminos} onChange={() => setTerminos(!terminos)} />
          <label htmlFor="terminos">
            Acepto los <a href="/terminos" style={{ color: 'blue', textDecoration: 'none' }}>términos y condiciones</a>
          </label>
          {errores.terminos && <span className="error">{errores.terminos}</span>}
        </div>

        <button type="submit">Registrarse</button>
      </form>

      {mensajeExito && <p className="success-message">{mensajeExito}</p>}

      <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión aqui.</a></p>
    </div>
  );
};

export default Register; // Exporta el componente Register para ser utilizado en la aplicación
