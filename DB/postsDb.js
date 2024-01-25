//import { generateError } from '../helpers.js';
import getConnection from './getPool.js';
import { generateError } from '../helpers.js';

//Función para poder crear un post
const createPost = async (title, url, description, userId) => {
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      `
      INSERT INTO posts (title, url, description, userId) VALUES (?,?,?,?)`,
      [title, url, description, userId]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  }
};

//Función que obtiene todos los posts de todos los usuarios
const getAllPosts = async (userId = 0) => {
  let connection;

  try {
    connection = await getConnection();

    let txtQuery = `
    SELECT a.*,
    COUNT(l.likeId) AS numLikes,
    COUNT(l2.likeId) > 0 AS isLiked
    FROM posts a 
    LEFT JOIN likes l ON a.postId = l.postId
    LEFT JOIN likes l2 ON a.postId = l2.postId AND l2.userId = ?
    GROUP BY a.postId ORDER BY a.createdAt DESC
    `
  
    //Obtenemos los datos publicos de todos los posts.
    const [posts] = await connection.query(txtQuery, [userId]);
    return posts;
  } finally {
    if (connection) connection.release();
  }
};

//Función que obtiene todos los post de un usuario concreto
const getAllPostsByUserId = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    //Obtenemos los datos publicos de todos los posts.
    const [posts] = await connection.query(
      `
      SELECT a.title, a.url, a.description, b.username, a.createdAt FROM posts a, users b where a.userId = b.userId and a.userId = ?
      `,
      [userId]
    );
    return posts;
  } finally {
    if (connection) connection.release();
  }
};

//Función para borrar un post concreto de un usuario en concreto
const deletePostById = async (postId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      'DELETE FROM posts WHERE postId = ?',
      [postId]
    );
  } finally {
    if (connection) connection.release();
  }
};

//Obtener un post concreto para verificar si el usuario es el autor del post. 
const getSinglePost = async (postId) => {
  let connection;

  try {
    connection = await getConnection();

    const [post] = await connection.query(
      'SELECT * FROM posts WHERE postId =?',
      [postId]
    );
    if (post.length === 0) {
      throw generateError(`El post con el id ${postId} no existe`, 404);
    }
    return post [0];
  } finally {
    if (connection) connection.release();
  }
}



 const likePost = async (userId, postId) => {//creamos funcion para likes
  let connection;

  try {
    connection = await getConnection();

    let isLiked;

    // compruebo si ya di like
     const [likes] = await connection.query(
      'SELECT * FROM likes WHERE userId = ? AND postId = ?',
      [userId, postId]
    );

    if(likes.length === 0){
      // si no di like añado tupla (insert)
     await connection.query(
        'INSERT INTO likes (userId, postId) VALUES (?, ?)',
        [userId, postId])
        isLiked = true;
    }else {
      // si di like elimino la tupla (delete)
     await connection.query(
        'DELETE FROM likes WHERE userId=? AND postId=?',
        [userId, postId])
      isLiked = false;
    }

    // Saco el numero de like del post
    const [result] = await connection.query(
      'SELECT count(*) AS numLikes FROM likes WHERE postId = ?',
      [postId]
    );
   
    return {
      numLikes: result[0].numLikes, 
      isLiked
    }
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
  likePost
};