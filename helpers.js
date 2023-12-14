// Esto nos permito no tener que escribir el tipo de error en cada archivo. Se encarga de crear un error.

const generateError = (message, status) => {
  const error = new Error(message);
  error.httpStatus = status;
  return error;
};
export { generateError };
