// Importa las funciones necesarias
import {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePostById,
  likePost,
  getAllPostsByUserId,
  searchPosts,
  createComment,
  getCommentsByPostId,
} from '../DB/postsDb.js';

import { generateError } from '../helpers.js';

// Función para validar si una cadena es una URL válida
const isValidHttpUrl = (string) => {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

// Controlador para obtener un post específico
const getPostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getSinglePost(postId);

    // Incluye el número total de "likes" en la respuesta
    const postWithLikes = {
      ...post,
      numLikes: post.numLikes || 0,
    };

    res.send({
      status: 'ok',
      data: postWithLikes,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener todos los posts
const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts();
    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para crear un nuevo post
const newPostController = async (req, res, next) => {
  try {
    const { title, url, description } = req.body;

    if (!req.userId) {
      throw generateError('Usuario no autenticado', 401);
    }

    if (!title || !url || !description) {
      throw generateError('Titulo, url y texto obligatorio', 400);
    }

    if (!isValidHttpUrl(url)) {
      throw generateError('URL no válida', 400);
    }

    const postId = await createPost(title, url, description, req.userId);
    res.send({
      status: 'ok',
      data: postId,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener todos los posts de un usuario específico
const getPostsByUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await getAllPostsByUserId(id);

    if (!posts || posts.length === 0) {
      throw generateError(`No se encontraron posts para el usuario con ID ${id}`, 404);
    }

    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para eliminar un post específico
const deletePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getSinglePost(postId);

    if (post.userId != req.userId) {
      throw generateError('No tienes permisos para borrar este post', 401);
    }

    await deletePostById(postId);
    res.send({
      status: 'ok',
      data: 'Post eliminado con éxito',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para dar like a un post específico
const likePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await getSinglePost(postId);

    if (post.userId == req.userId) {
      throw generateError('No puedes dar like a tu propio post', 401);
    }

    const { numLikes, isLiked } = await likePost(userId, postId);

    // Actualiza el número total de "likes" en el post
    post.numLikes = numLikes;

    res.send({
      status: 'ok',
      data: {
        numLikes,
        isLiked,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para buscar posts según un filtro
const searchPostsController = async (req, res, next) => {
  try {
    const filter = req.query.filter;

    // Realiza la búsqueda de posts según el filtro decodificado
    const posts = await searchPosts(filter);

    res.send({
      status: 'ok',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener comentarios de un post específico
const getCommentsByPostIdController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    // Lógica para obtener los comentarios del post con ID postId
    const comentarios = await getCommentsByPostId(postId);

    res.send({
      status: 'ok',
      data: comentarios,
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para crear un nuevo comentario en un post
const createCommentController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    // Validaciones adicionales para el texto del comentario
    if (!text || text.trim() === '') {
      throw generateError('El comentario no puede estar vacío', 400);
    }

    // Lógica para crear el comentario en el post con ID postId
    const nuevoComentarioId = await createComment(postId, req.userId, text);

    res.send({
      status: 'ok',
      data: nuevoComentarioId
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPostController,
  getPostsController,
  newPostController,
  deletePostController,
  likePostController,
  getPostsByUserController,
  searchPostsController,
  getCommentsByPostIdController,
  createCommentController,
};
