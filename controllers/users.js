import { generateError } from '../helpers.js';
import { createUser, getAllUsers, getUserById } from '../DB/usersDb.js';

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
const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      status: 'ok',
      message: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserController = async (req, res, next) => {
  try {
    const {id} = req.params;
    const user = await getUserById (id);

    res.send({
      status: 'ok',
      message: user,
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
export { newUserController, getAllUsersController, getUserController, loginController };
