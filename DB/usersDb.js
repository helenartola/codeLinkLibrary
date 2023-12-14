//Archivo donde vamos a crear funciones que se encarguen de hacer todo el trabajo relacionado con la base de datos.
//Esto debería hacer todo el trabajo de conectar con la base de datos

//Conectamos con la base de datos
import { generateError } from '../helpers.js';
import getConnection from './getPool.js';
import bcrypt from 'bcrypt';

//Creamos función async que recibe un email y una password.
//Crea un usuario en la base de datos y devuelve su id
const createUser = async (email, password) => {
  let connection;

  try {
    connection = await getConnection();
    //Comprobamos que no exista otro usuario con ese email
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

    // Encriptamos la password
    const passwordHash = await bcrypt.hash(password, 8);

    //Creamos el usuario
    const [newUser] = await connection.query(
      `
    INSERT INTO users (email, password) VALUES(?,?)`,
      [email, passwordHash]
    );
    //Devolvemos el id
    //insertId nos da el Id del elemento que acabamos de introducir
    return newUser.insertId;

    //si la connexión se ha creado, finalmente la cierra
  } finally {
    if (connection) connection.release();
  }
};

export { createUser };
