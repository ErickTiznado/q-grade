import { OpenAI } from 'openai';
import { useCallback } from 'react';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = {
  role: "system",
  content: `# Rol:
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
   - Analogías solo si el usuario pide ejemplos o muestra confusión (ej: "Los estándares ISO son como recetas para asegurar calidad").

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
- No uses jerga técnica sin definirla (ej: "CMMI (Capability Maturity Model Integration) es...").
- Nunca sugerir herramientas pagadas.` // Mantén tu prompt original aquí
};

export function useChat(model = 'deepseek-chat') {
  const sendMessage = useCallback(async (formData) => {
    try {
      // Extraer el mensaje y los archivos del FormData
      const message = formData.get('message');
      const files = formData.getAll('files');

      // Crear el mensaje del usuario
      const userMessage = {
        role: 'user',
        content: message,
        files: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      };

      // Crear el payload para la API
      const payload = {
        messages: [SYSTEM_PROMPT, userMessage],
        model: model,
        temperature: model === 'deepseek-reasoner' ? 0.3 : 0.7,
        max_tokens: 1000
      };

      // Si hay archivos, procesarlos y adjuntarlos al payload
      if (files.length > 0) {
        payload.files = files;
      }

      // Enviar la solicitud a la API
      const response = await openai.chat.completions.create(payload);

      return response.choices[0].message.content;
    } catch (err) {
      console.error('API Error:', err);
      throw new Error(err.message || 'Error al obtener respuesta del asistente');
    }
  }, [model]);

  return { sendMessage };
}