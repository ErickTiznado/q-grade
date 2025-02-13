// services/apiServices.js
const axios = require("axios");
const { API_KEY, API_URL, CHAT_MODEL, TEMPERATURE, MAX_TOKENS, REASONER_MODEL } = require("../config/deepseek");

class DeepSeekService {
  constructor() {
    // Configuramos la instancia inicial de Axios
    if (!API_URL || !API_KEY) {
      throw new Error('Configuracion incompleta en .env');
    }

    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 1000000,
    });
  }

  async generateResponse(messages, modelType = 'standard') {
    try {
      // Seleccionamos el modelo a utilizar según el parámetro recibido
      const model = modelType === 'reasoner' ? REASONER_MODEL : CHAT_MODEL;

      // Se realiza la petición POST a la API de DeepSeek
      const response = await this.client.post("/chat/completions", {
        model,
        messages,          // Aquí se envía el arreglo completo de mensajes (historial)
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        stream: false
      });

      // Se retorna el contenido de la respuesta del asistente
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error en DeepSeek API:', error.response?.data || error.message);
      throw new Error('Error al procesar la solicitud con DeepSeek');
    }
  }
}

module.exports = new DeepSeekService();
