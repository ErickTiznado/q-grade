// Cargamos las variables de entorno

require('dotenv').config();

// Importamos Express y CORS
const express = require('express');
const cors = require('cors');


//Instanciamos Express
const app = express()

// Definimos los Middlewares basicos

app.use(cors()); //Esto nos permite comunicarnos entre FrontEnd y Backend
app.use(express.json());


//Ruta de prueba

app.get('/', (req, res) => {
    res.send('Backend Funcionando')
})


app.get('/status', (req, res) => {
    res.json({
        status:'ok',
        timestamp: new Date().toISOString()
    })
})

//Importamos las rutas de el Chat
const chatRoutes = require('./src/routes/chatRoutes');

// Usaremos las rutas bajo el prefijo /api/chat
app.use('/api/chat', chatRoutes);

//Obtener el puerto de las variables de el entorno y si no hay se usara el 3000
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`)
})