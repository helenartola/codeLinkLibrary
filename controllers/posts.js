import { createPost, getAllPosts, getAllPostsByUserId } from "../DB/postsDb.js";
import { generateError } from "../helpers.js";

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      status: 'ok',
      message: posts,
    });
  } catch (error) {
    next(error);
  }
};

const isValidHttpUrl = (string) => {
  try {
  const newUrl = new URL(string);
  return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
 } catch {
  return false;
 }
}

const newPostController = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title ||!description) {
      throw generateError('Titulo y texto oblgatorio', 400);
    }

      //Validamos que la descripción sea una URL válida.
      if (!isValidHttpUrl(description)) {
        throw generateError('URL no válida', 400);
      }
    
   
    const postId = await createPost(title, description, req.user.id);
    res.send({
      status: 'ok',
      message: `Post creado con ${postId}`,
    });
    
  } catch (error) {
    next(error);
  }
}; 

const getPostsByUserController = async (req, res, next) => {
  try {
    const {id} = req.params;
    const posts = await getAllPostsByUserId(id);
    res.send({
      status: 'ok',
      message: posts,
    });
  } catch (error) {
    next(error);
  }
};

const deletePostController = async (req, res, next) => {
  try {
    res.send({
      status: 'error',
      message: 'Not implemented',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPostsController,
  newPostController,
  getPostsByUserController,
  deletePostController,
};
