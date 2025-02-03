import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Login/recuperar.css";
import {Logo} from '../UI/Logo';


const Recuperar = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [errores, setErrores] = useState({});
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setMostrarMensaje(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 🟢 Paso 1: Solicitar código de recuperación
  const solicitarCodigo = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/solicitar-recuperacion", { email });
      setStep(2);
    } catch (error) {
      setErrores({ email: error.response?.data?.message || "Error al solicitar código." });
    }
  };

  // 🔵 Paso 2: Verificar código y cambiar contraseña
  const cambiarContraseña = async (e) => {
    e.preventDefault();
    let valid = true;
    const errores = {};

    if (!nuevaContraseña || nuevaContraseña.length < 8) {
      errores.nuevaContraseña = "Debe tener al menos 8 caracteres";
      valid = false;
    }
    if (nuevaContraseña !== confirmarContraseña) {
      errores.confirmarContraseña = "Las contraseñas no coinciden";
      valid = false;
    }
    if (!codigo) {
      errores.codigo = "El código es obligatorio";
      valid = false;
    }

    if (!valid) {
      setErrores(errores);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/reset-password", {
        email,
        codigo,
        nuevaContraseña,
      });
      setStep(3);
      setMensajeExito("¡Cuenta recuperada exitosamente! Ahora puedes iniciar sesión.");
    } catch (error) {
      setErrores({ codigo: error.response?.data?.message || "Código incorrecto o expirado." });
    }
  };

  return (
  <main className="container">
      <Logo className={'Logo'}/>
    
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
            <label className="restore-label" htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Introduce tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errores.email && <span className="error">{errores.email}</span>}
          </div>
          <button className='restore-submit'  type="submit">Solicitar Código</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={cambiarContraseña}>
          <div className="form-group">
            <p>Hemos enviado un código de 5 dígitos a su correo electrónico</p>
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
            {errores.nuevaContraseña && <span className="error">{errores.nuevaContraseña}</span>}
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
            {errores.confirmarContraseña && <span className="error">{errores.confirmarContraseña}</span>}
          </div>

          <button className='restore-submit'  type="submit">Recuperar</button>

          {mostrarMensaje && (
            <p className="resend-message">
              ¿No has recibido el código?{" "}
              <button type="button" onClick={() => setCodigo("")}>
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
            <button className='restore-submit' >Iniciar sesión</button>
          </Link>
        </div>
      )}
    </div>
    </div>
    </main>
  );
};

export default Recuperar;
