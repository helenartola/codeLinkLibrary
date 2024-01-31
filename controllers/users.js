import { generateError } from '../helpers.js';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserLoginDataByEmail,
  deleteUserById,
} from '../DB/usersDb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Controlador para crear un nuevo usuario
const newUserController = async (req, res, next) => {
  try {
    // Extraemos los datos del cuerpo de la solicitud
    const { email, password, userName } = req.body;

    // Verificamos que se hayan recibido todos los campos obligatorios
    if (!email || !password || !userName) {
      throw generateError(
        'No se han recibido todos los campos obligatorios.',
        400
      );
    }

    // Creamos un nuevo usuario en la base de datos
    const id = await createUser(email, password, userName);

    // Respondemos con el ID del usuario creado
    res.send({
      status: 'ok',
      data: `User creado con id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener todos los usuarios
const getAllUsersController = async (req, res, next) => {
  try {
    // Obtenemos todos los usuarios de la base de datos
    const users = await getAllUsers();

    // Respondemos con la lista de usuarios
    res.send({
      status: 'ok',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener un usuario por su ID
const getUserController = async (req, res, next) => {
  try {
    // Obtenemos el ID del usuario de los parámetros de la solicitud
    const { id } = req.params;

    // Obtenemos el usuario por su ID de la base de datos
    const user = await getUserById(id);

    // Respondemos con la información del usuario
    res.send({
      status: 'ok',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para iniciar sesión
const loginController = async (req, res, next) => {
  try {
    // Extraemos el email y la contraseña del cuerpo de la solicitud
    const { email, password } = req.body;

    // Verificamos que se hayan proporcionado el email y la contraseña
    if (!email || !password) {
      throw generateError(
        'Es necesario introducir todos los campos obligatorios.',
        400
      );
    }

    // Obtenemos los datos privados del usuario por su email
    const user = await getUserLoginDataByEmail(email);

    // Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw generateError('El password es incorrecto.', 401);
    }

    // Creamos el payload para el token
    const payload = { userId: user.userId };

    // Generamos el token para el inicio de sesión con una duración de 30 días
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });

    // Respondemos con el token generado
    res.send({
      status: 'OK',
      data: {
        token,
        userName: user.userName,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para borrar un usuario
const deleteUserController = async (req, res, next) => {
  try {
    // Obtenemos el userId del token
    const userId = req.userId;

    // Borramos el usuario correspondiente al userId obtenido del token
    await deleteUserById(userId);

    // Respondemos con un mensaje indicando que el usuario ha sido eliminado
    res.send({
      status: 'ok',
      data: 'Usuario eliminado',
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones que importaremos en el server.js
export {
  newUserController,
  getAllUsersController,
  getUserController,
  loginController,
  deleteUserController,
};
