import getConnection from './getPool.js';
import { generateError } from '../helpers.js';

// Crear un nuevo post en la base de datos
const createPost = async (title, url, description, userId, categoriaId) => {
  let connection;

  try {
    connection = await getConnection();

    // Insertar un nuevo post en la base de datos
    const [result] = await connection.query(
      `
      INSERT INTO posts (title, url, description, userId, categoriaId) VALUES (?,?,?,?,?)
      `,
      [title, url, description, userId , categoriaId]
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

    // Consulta a la base de datos para obtener todos los posts con información adicional
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

    // Consulta a la base de datos para obtener los posts de un usuario específico
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

//Obtener un post individual por su ID
const getSinglePost = async (postId, userId = 0) => {
  let connection;

  try {
      // Console.log para mostrar el postId y userId
      console.log("PostId:", postId);
      console.log("UserId:", userId);
    // Establecer la conexión a la base de datos
    connection = await getConnection();

    // Consultar la base de datos para obtener un post individual por su ID
    const [post] = await connection.query(
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
      WHERE a.postId = ?
      GROUP BY a.postId ORDER BY a.createdAt DESC;
      `,
      [userId, userId, postId]
    );

    // Verificar si el post existe
    if (post.length === 0) {
      throw generateError(`El post con el id ${postId} no existe`, 404);
    }

    // Devolver el post individual
    return post[0];
  } finally {
    // Liberar la conexión a la base de datos
    if (connection) connection.release();
  }
};


// Dar like o quitar like a un post por su ID y el ID del usuario
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

    // Si el usuario no ha dado like, se agrega el like.
    if (likes.length === 0) {
      await connection.query(
        'INSERT INTO likes (userId, postId) VALUES (?, ?)',
        [userId, postId]
      );
      isLiked = true;
    } else {
      // Si el usuario ya dio like, se elimina el like.
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

// Obtener un posts que contenga un término específico en el título, descripción o URL.
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

// Crear un nuevo comentario en la base de datos
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

// Obtener todos los comentarios asociados a una publicación
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

// Guardar un post
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

// Obtener los posts guardados por un usuario
const getSavedPosts = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener los posts guardados por el usuario
    const [savedPosts] = await connection.query(
      `
      SELECT a.*, b.userName, b.useravatar,
      COUNT(l.likeId) AS numLikes,
      COUNT(l2.likeId) > 0 AS isLiked,
      COUNT(s.savedPostId) > 0 AS isSaved
      FROM posts a 
      JOIN users b ON a.userId = b.userId
      LEFT JOIN likes l ON a.postId = l.postId
      LEFT JOIN likes l2 ON a.postId = l2.postId AND l2.userId = ?
      INNER JOIN saved_posts s ON a.postId = s.postId AND s.userId = ?
      GROUP BY a.postId ORDER BY a.createdAt DESC;
      `,
      [userId, userId]
    );

    return savedPosts;
  } finally {
    if (connection) connection.release();
  }
};

// Eliminar un post guardado por su ID y el ID del usuario
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

// Eliminar un comentario por su ID y el ID del usuario
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

// Editar un post por su ID
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

// Editar un comentario por su ID
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

// Obtener los 5 posts más votados con el nombre de usuario
const getTopPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    // Consultar la base de datos para obtener los 5 posts ordenados por la cantidad de likes
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

    // Devolver los 5 posts más votados
    return topLikedPosts;
  } finally {
    if (connection) connection.release();
  }
};

// Obtenerbtener lista de categorias 
const fetchCategorias = async () => {
  let connection;
  
  try {

       connection = await getConnection();

      // Consultamos para obtener categorías 
      const categorias = await connection.query('SELECT id, name FROM categorias');
      
      // Verificamos si se encontraron categorías en la bd
      if (categorias && categorias.length > 1) {
          return categorias[0];
      } else {
          throw new Error("No se encontraron categorías.🔴");
      }
  } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw new Error("Error interno del servidor al obtener categorías.🔴");
  }
};

// Obtener todos los posts de una categoría
const getPostsByCategory = async (categoriaId) => {
  let connection;

  try {
    connection = await getConnection();

    const [posts] = await connection.query(
      `
      SELECT posts.*, users.userName, users.userAvatar
      FROM posts
      LEFT JOIN users ON posts.userId = users.userId
      WHERE posts.categoriaId = ?
      `,
      [categoriaId]
    );

    return posts;
  } catch (error) {
    console.error('Error al obtener posts por categoría:', error);
    throw new Error('Error al obtener posts por categoría.');
  } finally {
    if (connection) connection.release();
  }
};


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
  fetchCategorias,
  getPostsByCategory
};
