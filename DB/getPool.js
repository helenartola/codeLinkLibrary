import dotenv from 'dotenv'; //Importo dependendecia DOTENV que me sirve para acceder al archivo .env
import mysql from 'mysql2/promise'; //Importo dependencia de mysql para manejo de base de datos

dotenv.config(); //inicializo la dependencia de dotenv, lo que hace es agregar a las variables globales (process) las variables de entorno del archivo .env

const { DB_HOST, DB_USER, DB_NAME, DB_PASS, DB_PORT } = process.env; //Desestructuro el objeto creado en las variables de entorno que se encuentran en mi archivo .env

let pool; //Declaro la variable para mi POOL de conexiones (NO LA INICIALIZO)

const getConnection = async () => {
  //Inicia mi función getPool que devuelve el pool a crear
  try {
    //Inicia TRY
    if (!pool) {
      //Verifico que el pool no esté inicializado anteriormente

      pool = mysql.createPool({
        //Comienzo a crear el pool mediante MYSQL y le envío un objeto
        host: DB_HOST, //envio el host para la conexión
        user: DB_USER, //envio el user
        password: DB_PASS, //envio el password
        port: DB_PORT,
        connectionLimit: 10, //determino la cantidad máxima de conexiones (10 por poner 10)
        database: DB_NAME, //determino la base a la cual conectarme
        timezone: 'Z', //Z para horario UTC (horario global)
      }); //cierro el createPool
    } //cierro el if donde valido si no está inicializado el pool

    return await pool.getConnection(); //devuelvo el pool ya creado
  } catch (error) {
    //catcheo el error, recibo error como variable
    console.error(error); //muestro el error
  } //finaliza el trycatch
}; //finaliza la función

export default getConnection; //exporto por default la función
