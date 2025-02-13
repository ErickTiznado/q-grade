// src/controllers/chatController.js
const deepSeekService = require('../services/apiServices');
const pdfParse = require('pdf-parse');

/**
 * Función simple para contar tokens en un texto (aproximación basada en palabras).
 */
function countTokens(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Función para extraer el texto de un archivo según su tipo MIME.
 */
async function extractText(file) {
  if (file.mimetype === 'text/plain') {
    console.log(`Procesando archivo de texto: ${file.originalname}`);
    return file.buffer.toString('utf8');
  } else if (file.mimetype === 'application/pdf') {
    try {
      console.log(`Procesando PDF: ${file.originalname}`);
      const data = await pdfParse(file.buffer);
      return data.text;
    } catch (err) {
      console.error(`Error al extraer texto del PDF ${file.originalname}:`, err);
      return '';
    }
  } else if (file.mimetype.includes('word')) {
    console.log(`Procesando documento Word (placeholder): ${file.originalname}`);
    return 'Texto extraído de documento Word (funcionalidad por implementar)';
  } else if (file.mimetype.includes('excel')) {
    console.log(`Procesando documento Excel (placeholder): ${file.originalname}`);
    return 'Texto extraído de documento Excel (funcionalidad por implementar)';
  } else {
    console.warn(`Tipo MIME no soportado para ${file.originalname}: ${file.mimetype}`);
    return '';
  }
}

/**
 * Controlador para procesar el mensaje y los archivos adjuntos.
 */
exports.processMessage = async (req, res) => {
  try {
    let { message, modelType, conversation } = req.body;
    console.log("Cuerpo recibido:", req.body);
    console.log("Archivos recibidos:", req.files);

    // Si 'conversation' es una cadena, parsearla a array
    if (typeof conversation === 'string') {
      try {
        conversation = JSON.parse(conversation);
      } catch (err) {
        console.error("Error al parsear 'conversation':", err);
        conversation = [];
      }
    }

    // Procesamos los archivos adjuntos, si existen
    let docTexts = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const text = await extractText(file);
        console.log(`Texto extraído del archivo ${file.originalname}:`, text);
        if (text && text.trim() !== '') {
          const tokens = countTokens(text);
          // Se genera un fragmento con metadatos y contenido del archivo.
          const fragmento = `<DOCUMENTOADJUNTO nombre="${file.originalname}" tokens="${tokens}">\n${text}\n</DOCUMENTOADJUNTO>`;
          console.log(`Fragmento generado para ${file.originalname}:`, fragmento);
          docTexts.push(fragmento);
        } else {
          console.log(`No se extrajo texto útil de ${file.originalname}`);
        }
      }
    } else {
      console.log("No se recibieron archivos en la solicitud.");
    }

    // Se crea el contexto documental a partir de los archivos (si hay alguno)
    const documentContext = docTexts.join('\n\n');
    console.log("Contexto documental generado:", documentContext);

    // Concatenamos el contexto documental al mensaje del usuario (si existe contenido extraído)
    if (documentContext.trim() !== "") {
      message = `${message}\n\n<DOCUMENTOADJUNTO>\n${documentContext}\n</DOCUMENTOADJUNTO>`;
    }
    console.log("Mensaje final con contexto documental:", message);

    // Construcción del arreglo final de conversación según el modelo
    let finalConversation = [];
    if (modelType === 'reasoner') {
      finalConversation = [{ role: 'user', content: message }];
    } else {
      if (conversation && Array.isArray(conversation) && conversation.length > 0) {
        finalConversation = conversation;
      }
      finalConversation.push({ role: 'user', content: message });
    }
    console.log("Conversación final a enviar a DeepSeek:", finalConversation);

    // Validación mínima del mensaje
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El mensaje está vacío'
      });
    }

    // Llamada al servicio que consulta DeepSeek
    const response = await deepSeekService.generateResponse(finalConversation, modelType);
    console.log("Respuesta de DeepSeek:", response);

    res.json({
      success: true,
      reply: response,
      modelUsed: modelType || 'standard'
    });
  } catch (error) {
    console.error("Error en processMessage:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
