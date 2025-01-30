const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  const { nombres, apellidos, email, password, perfil } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new User({
      nombres,
      apellidos,
      email,
      password: hashedPassword,
      perfil,
    });

    await newUser.save();
    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" });
  }
};