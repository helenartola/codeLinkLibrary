import { generateError } from '../helpers.js';
import { createUser } from '../DB/usersDb.js';

const newUserController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError('Debes enviar un correo y una contraseña', 400);
    }

    const id = await createUser(email, password);
    console.log(id);

    res.send({
      status: 'ok',
      message: `User creado con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones que importaremos en el server.js
export { newUserController, getUserController, loginController };
