const axios = require("axios");
const { API_KEY, API_URL, CHAT_MODEL, TEMPERATURE, MAX_TOKENS, REASONER_MODEL} = require("../config/deepseek");
const { model } = require("mongoose");

class DeepSeekService{
    constructor() {
        //Configuramos la instancia inicial de AXIOS
        if(!API_URL || !API_KEY){
            throw new Error('Configuracion incompleta en .env')
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


    async generateResponse(messages, modelType = 'standard' ) {
        try{
            const model = modelType === 'reasoner' ? REASONER_MODEL : CHAT_MODEL;

            const response = await this.client.post("/chat/completions", {
                model,
                messages,
                temperature: TEMPERATURE,
                max_tokens: MAX_TOKENS,
                stream: false
            });

            return response.data.choices[0].message.content;
       
        } catch (error) {
            console.error('Error en DeepSeek API:', error.response?.data || error.message);
            throw new Error('Error al procesar la solicitud con DeepSeek');
        }

    }
}



module.exports = new DeepSeekService();