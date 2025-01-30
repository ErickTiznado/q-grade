const express = require("express");
const app = express();
app.use(express.json());

// Simula una respuesta de registro exitoso
app.post("/api/auth/register", (req, res) => {
  console.log("Datos recibidos:", req.body); // Muestra los datos en la consola
  res.status(201).json({ message: "Registro exitoso (simulado)" });
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});