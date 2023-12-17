//import { generateError } from '../helpers.js';
import getConnection from './getPool.js';

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
const getAllPosts = async () => {
  let connection;

  try {
    connection = await getConnection();

    //Obtenemos los datos publicos de todos los posts.
    const [posts] = await connection.query(
      `
      SELECT a.title, a.url, a.description, b.username, a.createdAt FROM posts a, users b where a.userId = b.userId
      `
    );
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

//Función que obtiene un post concreto de un usuario concreto

const getPostByUserIdAndPostId = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();

    const [post] = await connection.query(
      'SELECT * FROM posts WHERE userId = ? AND postId = ?',
      [userId, postId]
    );

    return post;
  } finally {
    if (connection) connection.release();
  }
};

//Función para borrar un post concreto de un usuario en concreto
const deletePostByUserIdAndPostId = async (userId, postId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(
      'DELETE FROM posts WHERE userId = ? AND postId = ?',
      [userId, postId]
    );
  } finally {
    if (connection) connection.release();
  }
};

/* const likes = async (userId, postId) => {//creamos funcion para likes
  let connection;

  try {
    connection = await getConnection();

    const [result] = await connection.query(
      'INSERT INTO likes (userId, postId) VALUES (?, ?)',
      [userId, postId]
    );

    return result.insertId;
  } finally {
    if (connection) connection.release();
  } 
};*/

// En postDB.js

// ...

/* const getLikesByUserAndPost = async (userId, postId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consulta los "Likes" para un usuario y un post específicos.
    const [likes] = await connection.query(
      'SELECT * FROM likes WHERE userId = ? AND postId = ?',
      [userId, postId]
    );

    return likes;
  } finally {
    if (connection) connection.release();
  }
}; */

export {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  deletePostByUserIdAndPostId,
  getPostByUserIdAndPostId,
  /* likes, getLikesByUserAndPost */
};
