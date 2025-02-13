import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Login/recuperar.css";
import { Logo } from '../UI/Logo';

const Recuperar = () => {
  const [step, setStep] = useState(1);
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setMostrarMensaje(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Paso 1: Solicitar avanzar al paso 2 sin validaciones
  const solicitarCodigo = (e) => {
    e.preventDefault();
    setStep(2); // Avanzar directamente al paso 2
  };

  // Paso 2: Verificar código y avanzar al paso 3 sin validación
  const cambiarContraseña = (e) => {
    e.preventDefault();
    setStep(3); // Avanzar directamente al paso 3
    setMensajeExito("Cuenta recuperada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.");
  };

  return (
    <main className="container">
      <Logo className={'Logo'} />
      <div className="recup-container">
        <div className="steps">
          <span className={step === 1 ? "step active" : "step"}>1</span>
          <span className={step === 2 ? "step active" : "step"}>2</span>
          <span className={step === 3 ? "step active" : "step"}>3</span>
        </div>
        <div className="recuperar-container">
          <h2 className="restore-title">Recuperar Contraseña</h2>

          {step === 1 && (
            <form onSubmit={solicitarCodigo}>
              <div className="form-group">
                <label className="restore-label" htmlFor="nuevaContraseña">Crear nueva contraseña</label>
                <input
                  type="password"
                  id="nuevaContraseña"
                  placeholder="Crea una contraseña segura"
                  value={nuevaContraseña}
                  onChange={(e) => setNuevaContraseña(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="restore-label" htmlFor="confirmarContraseña">Confirmar contraseña</label>
                <input
                  type="password"
                  id="confirmarContraseña"
                  placeholder="Confirma tu contraseña"
                  value={confirmarContraseña}
                  onChange={(e) => setConfirmarContraseña(e.target.value)}
                  required
                />
              </div>

              <button className='restore-submit' type="submit">Recuperar</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={cambiarContraseña}>
              <p className="info-message">Hemos enviado un código de 5 dígitos a su correo electrónico.</p>
              <div className="form-group">
                <input
                  type="text"
                  id="codigo"
                  placeholder="Introduce el código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>

              <button className='restore-submit' type="submit">Recuperar</button>

              {mostrarMensaje && (
                <p className="resend-message">
                  ¿No ha llegado el código?{" "}
                  <button type="button" onClick={() => setCodigo("")}>
                    Solicite uno nuevo
                  </button>
                </p>
              )}
            </form>
          )}

          {step === 3 && (
            <div>
              <p className="success-message">{mensajeExito}</p>
              <Link to="/login">
                <button className='restore-submit'>Iniciar sesión</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Recuperar;
