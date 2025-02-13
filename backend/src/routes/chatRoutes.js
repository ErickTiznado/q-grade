// src/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require('multer');

// Configuración de multer con almacenamiento en memoria.
const upload = multer({ storage: multer.memoryStorage() });

// Se espera que los archivos se envíen en el campo 'files'.
router.post('/', upload.array('files'), chatController.processMessage);

module.exports = router;
