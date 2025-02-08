const deepseek = require('../config/deepseek');
const deepSeekService = require('../services/apiServices');

exports.processMessage = async (req, res) => {
    try {
        const {message, modelType} = req.body;


        if(!message?.trim()) {
            return res.status(400).json({
                success:false,
                error:'El mensaje no puede estar vacio'
            });

        }
        const conversation = [{
            role: "system",
            content:""
        },
        {
            role:"user",
            content: message
        }    
    ];

    const response = await deepSeekService.generateResponse(conversation, modelType);

    res.json({
        success:true,
        reply:response,
        modelUsed: modelType || 'standard'
    });
    
    }catch(error){
        res.status(500).json({
            success:false,
            error: error.message
        })
    }
};