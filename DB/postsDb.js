//import { generateError } from '../helpers.js';
import getConnection from './getPool.js';

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

const getSinglePost = async (postId) => {
  let connection;

  try {
    connection = await getConnection();

    //Obtenemos los datos publicos del post del user.
    const [post] = await connection.query(//PENDIENTE HACER BIEN LA BUSQEDA EN MYSQL!!!!!
      `
      SELECT 
    posts.postId,
    posts.title,
    posts.url,
    posts.description,
    posts.createdAt AS postCreatedAt,
    users.userId AS userId,
    users.email,
    users.name,
    users.lastName,
    users.birthDate,
    users.userName,
    users.userAvatar,
    users.bio,
    users.createdAt AS userCreatedAt,
    users.modifiedAt AS userModifiedAt
FROM 
    posts
JOIN 
    users ON posts.userId = users.userId
WHERE 
    posts.postId = ?;
      `,
      [postId]
    );
    return post;
  } finally {
    if (connection) connection.release();
  }
};


const deletePostById = async (postId) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.query(`DELETE FROM posts WHERE postId =?,` [postId]);
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


export { createPost, getAllPosts, getAllPostsByUserId, deletePostById, getSinglePost, /* likes, getLikesByUserAndPost */ };
