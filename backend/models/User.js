const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombres: String,
  apellidos: String,
  email: { type: String, unique: true },
  password: String,
  perfil: String,
});

module.exports = mongoose.model("User", userSchema);