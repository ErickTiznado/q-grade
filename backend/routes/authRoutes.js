const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Correo electrónico inválido"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("La contraseña debe tener al menos 8 caracteres")
      .matches(/[0-9]/)
      .withMessage("La contraseña debe incluir al menos 1 número")
      .matches(/[!@#$%^&*]/)
      .withMessage("La contraseña debe incluir al menos 1 carácter especial"),
  ],
  authController.register
);

module.exports = router;