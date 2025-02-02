import React, { useState, useEffect } from "react"; // Importa React y los hooks useState y useEffect
import { Link } from "react-router-dom"; // Importa Link para la navegación entre rutas
import axios from "axios"; // Importa axios para realizar solicitudes HTTP
import "../Login/recuperar.css"; // Importa los estilos CSS para el componente de recuperación de contraseña

const Recuperar = () => {
  // Definición de estados para manejar el proceso de recuperación de contraseña
  const [step, setStep] = useState(1); // Estado para manejar los pasos del proceso
  const [email, setEmail] = useState(""); // Estado para almacenar el email del usuario
  const [nuevaContraseña, setNuevaContraseña] = useState(""); // Estado para la nueva contraseña
  const [confirmarContraseña, setConfirmarContraseña] = useState(""); // Estado para confirmar la contraseña
  const [codigo, setCodigo] = useState(""); // Estado para almacenar el código de recuperación
  const [mensajeExito, setMensajeExito] = useState(""); // Estado para mostrar mensajes de éxito
  const [errores, setErrores] = useState({}); // Estado para almacenar los mensajes de error
  const [mostrarMensaje, setMostrarMensaje] = useState(false); // Estado para mostrar mensaje de reenvío

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
    <div className="recuperar-container"> {/* Contenedor principal del formulario */}
      <div className="steps"> {/* Indicadores de pasos */}
        <span className={step === 1 ? "step active" : "step"}>1</span>
        <span className={step === 2 ? "step active" : "step"}>2</span>
        <span className={step === 3 ? "step active" : "step"}>3</span>
      </div>

      <h2>Recuperar Contraseña</h2>

      {step === 1 && (
        <form onSubmit={solicitarCodigo}> {/* Formulario de solicitud de código */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
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
          <button type="submit">Solicitar Código</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={cambiarContraseña}> {/* Formulario para ingresar código y nueva contraseña */}
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

export default Recuperar; // Exporta el componente Recuperar para ser utilizado en la aplicación
