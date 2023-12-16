import getPool from './getPool.js';
import mysql from 'mysql2/promise'; //Importo dependencia de mysql para manejo de base de datos

const main = async () => {
  // Variable que almacenará una conexión con la base de datos.
  let pool;

  try {
    pool = await getPool(mysql);

    console.log('Creando base de datos...');

    // Crear la base de datos si no existe.
    await pool.query(`
      CREATE DATABASE IF NOT EXISTS codelinklibrarydatabase;
    `);

    console.log('Seleccionando la base de datos...');

    // Seleccionar la base de datos recién creada o existente.
    await pool.query(`
      USE codelinklibrarydatabase;
    `);

    console.log('Borrando tablas...');

    await pool.query('DROP TABLE IF EXISTS users, posts');

    console.log('Creando tablas...');

    // Creamos la tabla de usuarios.
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                userId INT AUTO_INCREMENT PRIMARY KEY, 
                email VARCHAR(100) UNIQUE NOT NULL,
                name CHAR(20) NOT NULL,
                lastName CHAR(20) NOT NULL, 
                birthDate DATE NOT NULL, 
                userName VARCHAR(30) UNIQUE NOT NULL, 
                password VARCHAR(100) NOT NULL,
                userAvatar BLOB,
                bio VARCHAR(200),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
                modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
            )	
        `);

    // Creamos la tabla de posts.
    await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
                postId INT AUTO_INCREMENT PRIMARY KEY, 
                title VARCHAR(50) NOT NULL,
                url VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                userId INT,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (userId) REFERENCES users(userId)
            )
        `);
        //creamos tabla de likes
        await pool.query(`
        CREATE TABLE IF NOT EXISTS likes (
            likeId INT AUTO_INCREMENT PRIMARY KEY, 
            userId INT,
            FOREIGN KEY (userId) REFERENCES users(userId),
            postId INT,
            FOREIGN KEY (postId) REFERENCES posts(postId),
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('¡Tablas creadas!');
  } catch (err) {
    console.error(err);
  } finally {
    // Cerramos el proceso.
    process.exit();
  }
};

// Ejecutamos la función anterior.
main();
