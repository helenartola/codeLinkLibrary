import { generateError } from '../helpers.js';
import getConnection from './getPool.js';

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
      SELECT a.*,
      COUNT(l.likeId) AS numLikes,
      COUNT(l2.likeId) > 0 AS isLiked
      FROM posts a 
      LEFT JOIN likes l ON a.postId = l.postId
      LEFT JOIN likes l2 ON a.postId = l2.postId AND l2.userId = ?
      GROUP BY a.postId ORDER BY a.createdAt DESC
      `,
      [userId]
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
      SELECT a.title, a.url, a.description, b.username, a.createdAt FROM posts a, users b where a.userId = b.userId and a.userId = ?
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
    await connection.query(
      'DELETE FROM posts WHERE postId = ?',
      [postId]
    );
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
      await connection.query(
        'DELETE FROM likes WHERE userId=? AND postId=?',
        [userId, postId]
      );
      isLiked = false;
    }

    // Obtener el número total de likes para el post
    const [result] = await connection.query(
      'SELECT count(*) AS numLikes FROM likes WHERE postId = ?',
      [postId]
    );

    // Devolver el número total de likes y si el usuario dio like
    return {
      numLikes: result[0].numLikes,
      isLiked,
    };
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

// Exportar todas las funciones para su uso en otros archivos
export {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  getSinglePost,
  deletePostById,
  likePost,
  searchPosts,
};

