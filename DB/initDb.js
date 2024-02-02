// Importamos la función getConnection desde el archivo getPool.js.
import getConnection from './getPool.js';

// Definimos una función principal asíncrona.
const main = async () => {
  // Variable que almacenará una conexión con la base de datos.
  let connection;

  // Variable para almacenar el código de retorno (0 si todo está bien, 1 si hay un error).
  let returnCode = 0;

  try {
    // Obtenemos una conexión del pool utilizando la función getConnection.
    connection = await getConnection();

    console.log('Borrando tablas!...');

    // Ejecutamos una consulta SQL para borrar las tablas (likes, users, posts, comments, categorias).
    await connection.query('DROP TABLE IF EXISTS likes, users, posts, comments, categorias');

    console.log('Creando tablas!...');

    // Creamos la tabla de usuarios.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userId INT AUTO_INCREMENT PRIMARY KEY, 
        email VARCHAR(100) UNIQUE NOT NULL,
        name CHAR(20),
        lastName CHAR(20), 
        birthDate DATE, 
        userName VARCHAR(30) UNIQUE NOT NULL, 
        password VARCHAR(100) NOT NULL,
        userAvatar VARCHAR (100),
        bio VARCHAR(200),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
      )	
    `);

    // Creamos la tabla de categorias.
    await connection.query(`
     CREATE TABLE IF NOT EXISTS categorias (
      id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(50) UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      modifiedAt DATETIME ON UPDATE CURRENT_TIMESTAMP 
      )
    `);

    // Creamos la tabla de posts.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS posts (
        postId INT AUTO_INCREMENT PRIMARY KEY, 
        title VARCHAR(50) NOT NULL,
        url VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        userId INT,
        categoriaId INT,  -- Agregamos la referencia a la categoría
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, 
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (categoriaId) REFERENCES categorias(id)
      )
    `);

    // Creamos la tabla de likes.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS likes (
        likeId INT AUTO_INCREMENT PRIMARY KEY, 
        userId INT,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        postId INT,
        FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (userId, postId)
      )
    `);

    // Creamos la tabla de comentarios.
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        commentId INT AUTO_INCREMENT PRIMARY KEY, 
        postId INT,
        userId INT,
        text TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (postId) REFERENCES posts(postId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      )
    `);

    console.log('Tablas creadas!...');

    // Insertamos categorias en su tabla
    await connection.query(`
        INSERT INTO categorias(name)
        VALUES 
           ("HTML"),
           ("CSS"),
           ("JAVASCRIPT"),
           ("SQL"),
           ("NODE.JS"),
           ("REACT.JS"),
           ("JAVA"),
           ("PYTHON"),
           ("C"),
           ("C++"),
           ("C#"),
           ("PHP"),
           ("RUBY"),
           ("VISUAL BASIC.NET"),
           ("TYPESCRIPT"),
           ("POSTSCRIPT"),
           ("SWIFT"),
           ("RUST"),
           ("GIT"),
           ("Otros");
           ;
            `);

    console.log("Categorias creadas!");
    // Aviso de Final de proceso de creación de la BD.
    console.log("¡Base de Datos completa!✅");

  } catch (err) {
    // Si hay un error, imprimimos el error y actualizamos el código de retorno a 1.
    console.error(err);
    returnCode = 1;
  } finally {
    // Liberamos la conexión al pool (si existe) y salimos del proceso con el código de retorno.
    if (connection) connection.release();
    process.exit(returnCode);
  }
};

// Ejecutamos la función principal.
main();
