import { generateError } from '../helpers.js';
import getConnection from './getPool.js';

const createPost = async () => {
  let connection;

  try {
    connection = await getConnection();
   
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
      SELECT a.title, a.description, b.username, a.createdAt FROM posts a, users b where a.userId = b.userId
      `
    );
    return posts;
  } finally {
    if (connection) connection.release();
  }
}


export { createPost, getAllPosts };