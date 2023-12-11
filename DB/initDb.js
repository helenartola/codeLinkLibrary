import getPool from "./getPool.js";

const main = async () => {
  // Variable que almacenará una conexión con la base de datos.
  let pool;

  try {
    pool = await getPool();

    console.log("Creando base de datos...");

    // Crear la base de datos si no existe.
    await pool.query(`
      CREATE DATABASE IF NOT EXISTS codelinklibrarydatabase;
    `);

    console.log("Seleccionando la base de datos...");

    // Seleccionar la base de datos recién creada o existente.
    await pool.query(`
      USE codelinklibrarydatabase;
    `);

    console.log("Borrando tablas...");

    await pool.query("DROP TABLE IF EXISTS users, posts");

    console.log("Creando tablas...");

    // Creamos la tabla de usuarios.
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                userId INT PRIMARY KEY AUTO_INCREMENT, 
                email VARCHAR(100) UNIQUE NOT NULL,
                name CHAR(20) NOT NULL, 
                lastname CHAR(20) NOT NULL,
                age DATE NOT NULL,
                username VARCHAR(30) UNIQUE NOT NULL,
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
                postId CHAR(36) PRIMARY KEY NOT NULL,
                title VARCHAR(50) NOT NULL,
                description TEXT NOT NULL,
                userId CHAR(36) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (userId) REFERENCES users(userId)
            )
        `);

    console.log("¡Tablas creadas!");
  } catch (err) {
    console.error(err);
  } finally {
    // Cerramos el proceso.
    process.exit();
  }
};

// Ejecutamos la función anterior.
main();
