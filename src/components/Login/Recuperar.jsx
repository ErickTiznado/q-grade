import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Login/recuperar.css'

const Recuperar = () => {
  const [step, setStep] = useState(1);
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [codigo, setCodigo] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');
  const [errores, setErrores] = useState({});
  const [mostrarMensaje, setMostrarMensaje] = useState(false); // Estado para mostrar el mensaje

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setMostrarMensaje(true); // Mostrar el mensaje después de 2 segundos
      }, 2000);
      
      return () => clearTimeout(timer); // Limpiar el temporizador si el paso cambia antes de 2 segundos
    }
  }, [step]);

  const handleStepChange = (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    // Validación para el paso 1
    if (step === 1) {
      if (!nuevaContraseña || nuevaContraseña.length < 8) {
        errores.nuevaContraseña = 'La nueva contraseña debe tener al menos 8 caracteres';
        valid = false;
      }
      if (nuevaContraseña !== confirmarContraseña) {
        errores.confirmarContraseña = 'Las contraseñas no coinciden';
        valid = false;
      }
    }
    // Validación para el paso 2
    if (step === 2 && !codigo) {
      errores.codigo = 'El código es obligatorio';
      valid = false;
    }

    setErrores(errores);

    if (valid) {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        setStep(3);
        setMensajeExito('¡Cuenta recuperada exitosamente, Puedes iniciar sesión con su nueva contraseña.');
      }
    }
  };

  const handleNuevoCodigo = () => {
    setMostrarMensaje(false); // Ocultar el mensaje de nuevo código
    setCodigo(''); // Limpiar el campo de código
  };

  return (
    <div className="recuperar-container">
      <div className="steps">
        <span className={step === 1 ? 'step active' : 'step'}>1</span>
        <span className={step === 2 ? 'step active' : 'step'}>2</span>
        <span className={step === 3 ? 'step active' : 'step'}>3</span>
      </div>

      <h2>Recuperar Contraseña</h2>
      
      {step === 1 && (
        <form onSubmit={handleStepChange}>
          <div className="form-group">
            <label htmlFor="nuevaContraseña">Crear nueva contraseña</label>
            <input
              type="password"
              id="nuevaContraseña"
              placeholder="Crea una contraseña segura"
              value={nuevaContraseña}
              onChange={(e) => setNuevaContraseña(e.target.value)}
              required
            />
            {errores.nuevaContraseña && <span className="error">{errores.nuevaContraseña}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContraseña">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmarContraseña"
              placeholder="Confirma tu contraseña"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
              required
            />
            {errores.confirmarContraseña && <span className="error">{errores.confirmarContraseña}</span>}
          </div>

          <button type="submit">Recuperar</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStepChange}>
          <div className="form-group">
            <p>Hemos enviado un código de 5 dígitos a su  correo electrónico</p>
            <input
              type="text"
              id="codigo"
              placeholder="Introduce el código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
          
            {errores.codigo && <span className="error">{errores.codigo}</span>}
          </div>

          <button type="submit">Recuperar</button>

          {mostrarMensaje && (
            <p className="resend-message">
              ¿No ha caído el código?{' '}
              <button type="button" onClick={handleNuevoCodigo}>
                Solicita uno nuevo
              </button>
            </p>
          )}
        </form>
      )}

      {step === 3 && (
        <div>
          <p>{mensajeExito}</p>
          <Link to="/login">
            <button>Iniciar sesión</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Recuperar;
