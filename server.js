require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("🔥 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error de conexión a MongoDB:", err));

const UserSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  perfil: String,
  resetCode: String, 
  resetCodeExpires: Date, 
});

const User = mongoose.model("User", UserSchema);

// 📩 Configuración de Nodemailer para enviar correos desde Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Tu correo Gmail
    pass: process.env.GMAIL_PASS, // App Password generada
  },
});

// 🟢 Registrar usuario
app.post("/api/register", async (req, res) => {
  try {
    const { nombres, apellidos, email, password, perfil } = req.body;
    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ message: "El correo ya está en uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombres, apellidos, email, password: hashedPassword, perfil });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// 🔵 Login de usuario
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecto) {
      return res.status(400).json({ message: "Correo o contraseña incorrectos" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// 📩 Solicitar código de recuperación y enviarlo por correo
app.post("/api/solicitar-recuperacion", async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: "No se encontró el correo en la base de datos." });
    }

    // Generar código de 5 dígitos
    const codigoRecuperacion = crypto.randomInt(10000, 99999).toString();

    // Guardar el código en la base de datos con expiración de 15 minutos
    usuario.resetCode = codigoRecuperacion;
    usuario.resetCodeExpires = Date.now() + 15 * 60 * 1000;
    await usuario.save();

    // ✉️ Enviar el correo con el código de recuperación
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Código de Recuperación de Contraseña",
      text: `Tu código de recuperación es: ${codigoRecuperacion}\n\nEste código expira en 15 minutos.`,
    };

    await transporter.sendMail(mailOptions);

    console.log(`📩 Código enviado a: ${email} | Código: ${codigoRecuperacion}`);
    res.json({ message: "Código de recuperación enviado a tu correo." });
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

// 🔑 Cambiar contraseña con código de recuperación
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, codigo, nuevaContraseña } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario || usuario.resetCode !== codigo || usuario.resetCodeExpires < Date.now()) {
      return res.status(400).json({ message: "Código inválido o expirado." });
    }

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
    usuario.password = hashedPassword;
    usuario.resetCode = null;
    usuario.resetCodeExpires = null;
    await usuario.save();

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

// 🟣 Iniciar servidor
app.listen(5000, () => console.log("🔥 Servidor corriendo en el puerto 5000"));
