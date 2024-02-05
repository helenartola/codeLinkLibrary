//Archivo donde vamos a crear funciones que se encarguen de hacer todo el trabajo relacionado con la base de datos.
//Esto debería hacer todo el trabajo de conectar con la base de datos

//Conectamos con la base de datos
import { generateError } from '../helpers.js';
import getConnection from './getPool.js';
import bcrypt from 'bcrypt';

//Creamos función async que recibe un email y una password.
//Crea un usuario en la base de datos y devuelve su id
const createUser = async (email, password, userName) => {
  let connection;

  try {
    connection = await getConnection();

    //Comprobamos que no exista otro usuario con ese email
    {
      //Los corchetes de user los ponemos para desestructurar y que coja solo el primer valor del array que no va a devolver el await
      const [user] = await connection.query(
        `
        SELECT userId FROM users WHERE email = ?
        `,
        [email]
      );
      //con el if le vamos a decir que si el usuario es mayor de 1 nos devuelva que ya existe un usuario con el mismo email.
      if (user.length > 0) {
        throw generateError(
          'Ya existe un usuario en la base de datos con este email.',
          409
        );
      }
    }

    //Comprobamos que no exista otro usuario con ese userName
    {
      const [user] = await connection.query(
        `
        SELECT userId FROM users WHERE userName = ?
        `,
        [userName]
      );
      //con el if le vamos a decir que si el usuario es mayor de 1 nos devuelva que ya existe un usuario con el mismo userName.
      if (user.length > 0) {
        throw generateError(
          'Ya existe un usuario en la base de datos con este nombre de usuario.',
          409
        );
      }
    }

    //Comprobamos que la fecha resibida es válida y la formateamos correctamente
    /*
    let finalDate;
    {
      let dateObj = new Date(birthDate);
      if (!isNaN(dateObj) && dateObj < new Date()) {
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        finalDate = `${year}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }`;
      } else {
        throw generateError('Fecha de nacimiento invalida', 400);
      }
    }
    */

    // Encriptamos la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Creamos el usuario
    const [newUser] = await connection.query(
      `INSERT INTO users (email, password,  userName) VALUES(?,?,?)`,
      [email, passwordHash, userName]
    );
    //Devolvemos el id
    //insertId nos da el Id del elemento que acabamos de introducir
    return newUser.insertId;

    //si la connexión se ha creado, finalmente la cierra
  } finally {
    if (connection) connection.release();
  }
};
//Obtenemos los datos públicos de todos los usuarios de la base de datos y omitimos información sensible como id, password, email, etc
const getAllUsers = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [users] = await connection.query(
      `
      SELECT * FROM users 
      `
    );
    return users;
  } finally {
    if (connection) connection.release();
  }
};
//Obtenemos los datos públicos del usuario solicitado
const getUserById = async (id) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
      SELECT * FROM users WHERE userId = ?
      `,
      [id]
    );

    if (user.length === 0) {
      throw generateError(`El usuario con el id ${id} no existe`, 404);
    }
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

// Obtenemos datos privados del usuario solicitado, necesarios para el login
const getUserLoginDataByEmail = async (email) => {
  let connection;

  try {
    connection = await getConnection();
    const [user] = await connection.query(
      `
      SELECT userId, userName, password FROM users WHERE email = ?`,
      [email]
    );

    if (user.length === 0) {
      throw generateError(`El usuario con el email ${email} no existe`, 404);
    }
    return user[0];
  } finally {
    if (connection) connection.release();
  }
};

const updateUserById = async (userId, updatedFields) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      'UPDATE users SET name=?, lastName=?, birthDate=?, bio=? WHERE userId=?',
      [
        updatedFields.firstName,
        updatedFields.lastName,
        updatedFields.birthDate,
        updatedFields.bio,
        userId,
      ]
    );

    // Obtén y devuelve el usuario actualizado
    const [updatedUser] = await connection.query(
      'SELECT * FROM users WHERE userId = ?',
      [userId]
    );

    if (updatedUser.length === 0) {
      throw generateError("No se pudo encontrar el usuario actualizado., 500");
    }

    return updatedUser[0];
  } finally {
    if (connection) connection.release();
  }
};

const deleteUserById = async (userId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(`DELETE FROM users WHERE userId =?`, [userId]);
  } finally {
    if (connection) connection.release();
  }
};

export {
  createUser,
  getAllUsers,
  getUserById,
  getUserLoginDataByEmail,
  updateUserById,
  deleteUserById,
};
