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
 * Función para obtener la extensión del archivo en minúsculas.
 */
function getFileExtension(filename) {
  return filename.substring(filename.lastIndexOf(".")).toLowerCase();
}

/**
 * Función para extraer el texto de un archivo según su tipo MIME o extensión.
 */
async function extractText(file) {
  // Definimos las extensiones de archivos de código que se tratarán como texto.
  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.html', '.py', '.c', '.cs'];
  
  // Extraemos la extensión del archivo.
  const ext = getFileExtension(file.originalname);

  // Si el MIME type es 'text/plain' o si la extensión indica un archivo de código, lo tratamos como texto.
  if (file.mimetype === 'text/plain' || codeExtensions.includes(ext)) {
    console.log(`Procesando archivo de texto/código: ${file.originalname}`);
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

    // Si 'conversation' es una cadena, se intenta parsearla a array.
    if (typeof conversation === 'string') {
      try {
        conversation = JSON.parse(conversation);
      } catch (err) {
        console.error("Error al parsear 'conversation':", err);
        conversation = [];
      }
    }

    // Procesamos los archivos adjuntos, si existen.
    let docTexts = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const text = await extractText(file);
        console.log(`Texto extraído del archivo ${file.originalname}:`, text);
        if (text && text.trim() !== '') {
          const tokens = countTokens(text);
          // Generamos un fragmento con metadatos y contenido del archivo.
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

    // Se crea el contexto documental a partir de los archivos (si hay alguno).
    const documentContext = docTexts.join('\n\n');
    console.log("Contexto documental generado:", documentContext);

    // Concatenamos el contexto documental al mensaje del usuario (si existe contenido extraído).
    if (documentContext.trim() !== "") {
      message = `${message}\n\n<DOCUMENTOADJUNTO>\n${documentContext}\n</DOCUMENTOADJUNTO>`;
    }
    console.log("Mensaje final con contexto documental:", message);

    // Definimos el mensaje de sistema que orienta al modelo.
    const systemPrompt = `# Rol:
Eres **Q-Grade**, un asistente pedagógico especializado en Calidad de Software, con tono amigable pero profesional.
**Misión**: Introducir conceptos básicos de calidad de software de manera concisa, sin sobrecarga teórica, adaptándote a consultas casuales y técnicas.

# Temas Cubiertos (Nivel Básico):
1. Introducción a la Calidad de Software
2. Modelos y Estándares (ISO 25010, CMMI, TMMi)
3. Métricas Formales vs. Métricas de Calidad
4. Proceso de Evaluación de Calidad (5 pasos clave)

# Instrucciones Técnicas:
1. **Interacción Natural**:
   - Responde saludos y conversaciones casuales con cordialidad (ej: "¡Hola! 👋 ¿En qué tema de calidad de software te puedo ayudar hoy?").
   - Mantén coherencia en diálogos largos (recuerda contexto previo sin repetir información).

2. **Precisión y Concisión**:
   - Explica conceptos en ≤ 3 párrafos, usando viñetas para listas técnicas.
   - Usa analogías solo si el usuario lo pide o muestra confusión (ej: "Los estándares ISO son como recetas para asegurar calidad").

3. **Gestión de Desvíos**:
   - Si la pregunta no es sobre calidad de software, responde amablemente:
     "Mi expertise es calidad de software. ¿Tienes alguna duda sobre [listar temas cubiertos]?"

4. **Ejemplos Prácticos**:
   - Incluye mini-casos de uso para temas complejos (ej: "Para evaluar calidad en código, un equipo podría medir:
     - % de cobertura de tests
     - Número de bugs críticos abiertos
     - Tiempo promedio de resolución de incidencias").

# Estilo Prohibido:
- Evita explicaciones históricas o teóricas extensas.
- No uses jerga técnica sin definirla.
- No sugieras herramientas pagadas.

Adicionalmente, todo lo que se encuentre entre las etiquetas <DOCUMENTOADJUNTO> y </DOCUMENTOADJUNTO> corresponde a archivos adjuntos y debe interpretarse como tal. Sigue las instrucciones del usuario sobre cómo proceder con ese archivo.
`;

    // Construcción del arreglo final de conversación según el modelo, incluyendo el mensaje de sistema.
    let finalConversation = [];
    // Insertamos el mensaje de sistema al inicio
    finalConversation.push({
      role: 'system',
      content: systemPrompt
    });

    if (modelType === 'reasoner') {
      finalConversation.push({ role: 'user', content: message });
    } else {
      if (conversation && Array.isArray(conversation) && conversation.length > 0) {
        finalConversation = finalConversation.concat(conversation);
      }
      finalConversation.push({ role: 'user', content: message });
    }
    console.log("Conversación final a enviar a DeepSeek:", finalConversation);

    // Validación mínima del mensaje.
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'El mensaje está vacío'
      });
    }

    // Llamada al servicio que consulta DeepSeek.
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
