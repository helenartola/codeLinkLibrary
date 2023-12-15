import { generateError } from '../helpers.js';
import { createUser, getAllUsers, getUserById, getUserLoginDataByEmail} from '../DB/usersDb.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const newUserController = async (req, res, next) => {
  try {
    const { email, password, name, lastName, birthDate, userName, bio } = req.body;

    if (!email || !password || !name || !lastName || !birthDate ||!userName) {
      throw generateError('No se han recibido todos los campos obligatorios.', 400);
    }

    const id = await createUser(email, password, name, lastName, birthDate, userName, bio);
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
    const { email, password } = req.body;
    if (!email ||!password) {  
      throw generateError ('Es necesario introducir todos los campos obligatorios.', 400);
    }
    // Obtenemos datos privados del usuario
    const user = await getUserLoginDataByEmail(email);

    // Comprobamos que la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw generateError ('El password es incorrecto.', 401);
    }

    //Creamos el payload para el token
    const payload = {userId: user.userId};

    // Generamos el token para el inicio de sesión
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });

    res.send({
      status: 'OK',
      message: token,
    });
  } catch (error) {
    next(error);
  }
};

// Exportamos las funciones que importaremos en el server.js
export { newUserController, getAllUsersController, getUserController, loginController };
