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
      SELECT a.title, a.url, a.description, b.userId, a.createdAt FROM posts a, users b WHERE a.userId = b.userId and a.postId = ?
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

export { createPost, getAllPosts, getAllPostsByUserId, deletePostById, getSinglePost };
