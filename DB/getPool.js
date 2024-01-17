import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { generateError } from '../helpers.js';

dotenv.config();

const { DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_PORT } = process.env;

let pool;

const getConnection = async () => {
  try {
    // Verifico si el pool aún no ha sido inicializado
    if (!pool) {
      // Creo el pool si aún no ha sido inicializado
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASS,
        port: DB_PORT,
        connectionLimit: 10,
        database: DB_NAME,
        timezone: 'Z',
      });
    }

    // Devuelvo una conexión del pool
    return await pool.getConnection();
  } catch (error) {
    // En caso de error, lanzo una excepción con un mensaje descriptivo
    throw generateError('Acceso denegado a la base de datos, 401.');
  }
};

export default getConnection;
