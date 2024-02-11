import { generateError } from '../helpers.js';
import getConnection from './getPool.js';
import bcrypt from 'bcrypt';

//Crear un usuario
const createUser = async (email, password, userName) => {
  let connection;

  try {
    connection = await getConnection();

    //Comprobamos que no exista otro usuario con ese email
    {
      const [user] = await connection.query(
        `
        SELECT userId FROM users WHERE email = ?
        `,
        [email]
      );

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
      
      if (user.length > 0) {
        throw generateError(
          'Ya existe un usuario en la base de datos con este nombre de usuario.',
          409
        );
      }
    }

    // Encriptamos la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Creamos el usuario
    const [newUser] = await connection.query(
      `INSERT INTO users (email, password,  userName) VALUES(?,?,?)`,
      [email, passwordHash, userName]
    );
    //Devolvemos el id
    return newUser.insertId;

  } finally {
    if (connection) connection.release();
  }
};

//Obtenemos los datos públicos de todos los usuarios
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

// Actualiza datos del usuario


const updateUserById = async (userId, updatedFields) => {
  let connection;
  try {
    connection = await getConnection();
    // Encriptar la nueva contraseña
    let hashedPassword = updatedFields.password;
    if (updatedFields.password) {
      hashedPassword = await bcrypt.hash(updatedFields.password, 10);
    }
    await connection.query(
      'UPDATE users SET name=?, lastName=?, birthDate=?, bio=?, password=? WHERE userId=?',
      [
        updatedFields.name,
        updatedFields.lastName,
        updatedFields.birthDate,
        updatedFields.bio,
        hashedPassword, // Se pasa la contraseña encriptada
        userId,
      ]
    );
    
    // Obtén y devuelve el usuario actualizado
    const [updatedUser] = await connection.query(
      'SELECT * FROM users WHERE userId = ?',
      [userId]
    );

    if (updatedUser.length === 0) {
      throw generateError("No se pudo encontrar el usuario actualizado.", 500);
    }

    return updatedUser[0];
  } finally {
    if (connection) connection.release();
  }
};


//Elimina el usuario de la base de datos por su ID
const deleteUserById = async (userId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      `DELETE FROM users WHERE userId =?`, 
      [userId]);
      
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
