// Función para generar un objeto de error con un mensaje y código de estado HTTP específicos
const generateError = (message, status) => {
  // Crear un nuevo objeto de error con el mensaje proporcionado
  const error = new Error(message);
  
  // Agregar una propiedad 'httpStatus' al objeto de error para almacenar el código de estado HTTP
  error.httpStatus = status;
  
  // Devolver el objeto de error generado
  return error;
};

// Exportar la función generateError para su uso en otros archivos
export { generateError };

