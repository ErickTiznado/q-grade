// src/api/api.js
export async function sendMessage(payload) {
  const formData = new FormData();
  
  // Agregamos los campos de texto
  formData.append('message', payload.message);
  formData.append('modelType', payload.modelType);
  formData.append('conversation', JSON.stringify(payload.conversation || []));
  
  // Agregamos cada archivo individualmente (ahora, payload.files es un array de File)
  if (payload.files && payload.files.length > 0) {
    payload.files.forEach(file => {
      formData.append('files', file);
    });
  }
  
  // Realizamos la petición a tu backend
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    body: formData
    // No establezcas el Content-Type manualmente; el navegador lo hace automáticamente
  });
  
  if (!response.ok) {
    throw new Error('Error en la solicitud');
  }
  
  return await response.json();
}
