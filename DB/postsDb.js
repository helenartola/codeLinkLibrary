// Importa la función de conexión a la base de datos y las utilidades de manejo de errores
import getConnection from './getPool.js';
import { generateError } from '../helpers.js';

// Función para crear un nuevo post en la base de datos
const createPost = async (title, url, description, userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertar un nuevo post en la base de datos
    const [result] = await connection.query(
      `
      INSERT INTO posts (title, url, description, userId) VALUES (?,?,?,?)
      `,
      [title, url, description, userId]
    );

    // Devolver el ID del post recién creado
    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

// Obtener todos los posts de todos los usuarios con información adicional como el número de likes
const getAllPosts = async (userId = 0) => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener todos los posts con información adicional
    const [posts] = await connection.query(
      `
      SELECT a.*, b.userName, b.useravatar,
      COUNT(l.likeId) AS numLikes,
      COUNT(l2.likeId) > 0 AS isLiked,
      COUNT(s.savedPostId) > 0 AS isSaved
      FROM posts a 
      JOIN users b ON a.userId = b.userId
      LEFT JOIN likes l ON a.postId = l.postId
      LEFT JOIN likes l2 ON a.postId = l2.postId AND l2.userId = ?
      LEFT JOIN saved_posts s ON a.postId = s.postId AND s.userId = ?
      GROUP BY a.postId ORDER BY a.createdAt DESC;
      `,
      [userId, userId]
    );

    // Devolver la lista de posts con información adicional
    return posts;
  } finally {
    if (connection) connection.release();
  }
};

// Obtener todos los posts de un usuario específico
const getAllPostsByUserId = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener los posts de un usuario específico
    const [posts] = await connection.query(
      `
      SELECT a.* FROM posts a, users b where a.userId = b.userId and a.userId = ?
      `,
      [userId]
    );

    // Devolver la lista de posts del usuario
    return posts;
  } finally {
    if (connection) connection.release();
  }
};

// Borrar un post por su ID
const deletePostById = async (postId) => {
  let connection;
  try {
    connection = await getConnection();

    // Borrar el post de la base de datos por su ID
    await connection.query('DELETE FROM posts WHERE postId = ?', [postId]);
  } finally {
    if (connection) connection.release();
  }
};

// Obtener un post individual por su ID
const getSinglePost = async (postId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener un post individual por su ID
    const [post] = await connection.query(
      'SELECT * FROM posts WHERE postId =?',
      [postId]
    );

    // Verificar si el post existe
    if (post.length === 0) {
      throw generateError(`El post con el id ${postId} no existe`, 404);
    }

    // Devolver el post individual
    return post[0];
  } finally {
    if (connection) connection.release();
  }
};

// Función para dar like o quitar like a un post por su ID y el ID del usuario
const likePost = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();

    // Iniciar transacción para garantizar la integridad de la base de datos
    await connection.beginTransaction();

    let isLiked;

    // Verificar si el usuario ya dio like al post
    const [likes] = await connection.query(
      'SELECT * FROM likes WHERE userId = ? AND postId = ?',
      [userId, postId]
    );

    // Si el usuario no ha dado like, se agrega el like (insert)
    if (likes.length === 0) {
      await connection.query(
        'INSERT INTO likes (userId, postId) VALUES (?, ?)',
        [userId, postId]
      );
      isLiked = true;
    } else {
      // Si el usuario ya dio like, se elimina el like (delete)
      await connection.query('DELETE FROM likes WHERE userId=? AND postId=?', [
        userId,
        postId,
      ]);
      isLiked = false;
    }

    // Obtener el número total de likes para el post
    const [result] = await connection.query(
      'SELECT count(*) AS numLikes FROM likes WHERE postId = ?',
      [postId]
    );

    // Confirmar la transacción
    await connection.commit();

    // Devolver el número total de likes y si el usuario dio like
    return {
      numLikes: result[0].numLikes,
      isLiked,
    };
  } catch (error) {
    // Revertir la transacción en caso de error
    if (connection) await connection.rollback();
    throw error; // Propagar el error después de revertir la transacción
  } finally {
    if (connection) connection.release();
  }
};

// Función para buscar posts que contengan un término específico en el título, descripción o URL
const searchPosts = async (filter) => {
  let connection;

  try {
    connection = await getConnection();

    // Ajustar el filtro para buscar en cualquier posición del título, descripción o URL (case-insensitive)
    let finalFilter = `%${filter}%`;

    // Consultar la base de datos para obtener los posts que coinciden con el filtro
    const [posts] = await connection.query(
      `
      SELECT * FROM posts WHERE UPPER(title) LIKE UPPER(?) OR UPPER(description) LIKE UPPER(?) OR UPPER(url) LIKE UPPER(?)
      `,
      [finalFilter, finalFilter, finalFilter]
    );

    // Devolver la lista de posts que coinciden con el filtro
    return posts;
  } finally {
    if (connection) connection.release();
  }
};

// Función para crear un nuevo comentario en la base de datos
const createComment = async (postId, userId, text) => {
  let connection;

  try {
    // Validaciones
    if (!postId || !userId || !text) {
      throw new Error('Todos los campos son obligatorios.');
    }

    // Otras validaciones
    connection = await getConnection();

    // Usar el método INSERT para añadir un nuevo comentario
    const [result] = await connection.query(
      `
      INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)
      `,
      [postId, userId, text]
    );

    // Verificar si se insertó correctamente y devolver el ID del comentario
    if (result.affectedRows !== 1) {
      throw new Error(
        'No se pudo insertar el comentario. Afectó a ' +
          result.affectedRows +
          ' filas.'
      );
    }

    return result.insertId;
  } catch (error) {
    // Manejo de Errores
    console.error('Error al crear un comentario:', error.message);
    throw error; // Lanzar el error original para obtener más detalles
  } finally {
    if (connection) connection.release();
  }
};

// Función para obtener todos los comentarios asociados a una publicación
const getCommentsByPostId = async (postId) => {
  let connection;

  try {
    // Validaciones
    if (!postId) {
      throw new Error('El postId es obligatorio.');
    }

    connection = await getConnection();

    const [comments] = await connection.query(
      `
      SELECT a.*, b.userName, b.userAvatar 
      FROM comments a, users b 
      WHERE a.userId = b.userId AND a.postId = ?
      `,
      [postId]
    );
    return comments;
  } catch (error) {
    // Manejo de Errores
    console.error('Error al obtener comentarios:', error.message);
    throw new Error(
      'No se pudieron obtener los comentarios. Por favor, inténtalo de nuevo.'
    );
  } finally {
    if (connection) connection.release();
  }
};

// Función para guardar un post
const savePost = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();

    // Verificar si el usuario está intentando guardar su propio post
    const [post] = await connection.query(
      'SELECT userId FROM posts WHERE postId = ?',
      [postId]
    );

    if (post.length === 1 && post[0].userId === userId) {
      throw generateError('No puedes guardar tu propio post', 400);
    }

    // Insertar un nuevo registro en la tabla de posts guardados
    await connection.query(
      'INSERT INTO saved_posts (userId, postId) VALUES (?, ?)',
      [userId, postId]
    );
  } finally {
    if (connection) connection.release();
  }
};

// Función para obtener los posts guardados por un usuario
const getSavedPosts = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener los posts guardados por el usuario
    const [savedPosts] = await connection.query(
      `
      SELECT p.*, COUNT(sp.savedPostId) AS numSavedPosts
      FROM saved_posts sp
      JOIN posts p ON sp.postId = p.postId
      WHERE sp.userId = ?
      GROUP BY p.postId;
      `,
      [userId]
    );

    return savedPosts;
  } finally {
    if (connection) connection.release();
  }
};





// Función para eliminar un post guardado por su ID y el ID del usuario
const unsavePost = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();

    // Eliminar el post guardado por su ID y el ID del usuario
    await connection.query(
      'DELETE FROM saved_posts WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
  } finally {
    if (connection) connection.release();
  }
};

// Función para eliminar un comentario por su ID y el ID del usuario
const deleteComment = async (postId, commentId, userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Verificar si el comentario pertenece al usuario actual
    const [comment] = await connection.query(
      'SELECT * FROM comments WHERE commentId = ? AND userId = ?',
      [commentId, userId]
    );

    if (comment.length === 0) {
      throw generateError(
        'No tienes permisos para eliminar este comentario',
        401
      );
    }

    // Eliminar el comentario de la base de datos
    await connection.query('DELETE FROM comments WHERE commentId = ?', [
      commentId,
    ]);
  } finally {
    if (connection) connection.release();
  }
};

// Función para editar un post por su ID
const editPost = async (postId, title, url, description) => {
  let connection;
  try {
    connection = await getConnection();

    // Actualizar el post en la base de datos por su ID
    await connection.query(
      'UPDATE posts SET title = ?, url = ?, description = ? WHERE postId = ?',
      [title, url, description, postId]
    );
  } finally {
    if (connection) connection.release();
  }
};

// Función para editar un comentario por su ID
const editComment = async (commentId, text) => {
  let connection;
  try {
    connection = await getConnection();

    // Actualizar el comentario en la base de datos por su ID
    await connection.query('UPDATE comments SET text = ? WHERE commentId = ?', [
      text,
      commentId,
    ]);
  } finally {
    if (connection) connection.release();
  }
};

// Función para obtener los 10 posts más votados con el nombre de usuario
const getTopPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener los 10 posts ordenados por la cantidad de likes
    const [topLikedPosts] = await connection.query(
      `
      SELECT p.*, u.username, COUNT(l.likeId) AS numLikes
      FROM posts p
      LEFT JOIN likes l ON p.postId = l.postId
      JOIN users u ON p.userId = u.userId
      GROUP BY p.postId
      ORDER BY numLikes DESC
      LIMIT 5
      `
    );

    // Devolver los 10 posts más votados
    return topLikedPosts;
  } finally {
    if (connection) connection.release();
  }
};

// Exportar todas las funciones para su uso en otros archivos
export {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  getSinglePost,
  deletePostById,
  likePost,
  searchPosts,
  createComment,
  getCommentsByPostId,
  savePost,
  getSavedPosts,
  unsavePost,
  deleteComment,
  editComment,
  editPost,
  getTopPosts,
};
