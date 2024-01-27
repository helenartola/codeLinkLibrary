// Importo 'querystring' sin desestructuración, ya que decodeURIComponent está disponible globalmente
//import querystring from 'querystring';

import {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePostById,
  likePost,
  getAllPostsByUserId,
  searchPosts
} from '../DB/postsDb.js';

import { generateError } from '../helpers.js';

// Controlador para obtener un post específico
const getPostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await getSinglePost(postId);
    res.send({
      status: 'ok',
      data: post,
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

// Función para validar si una cadena es una URL válida
const isValidHttpUrl = (string) => {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch {
    return false;
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
      data: postId
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
    
    // Decodifica el filtro utilizando 'querystring'
    //const decodedFilter = querystring.decode(filter);
    
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


export {
  getPostController,
  getPostsController,
  newPostController,
  deletePostController,
  likePostController,
  getPostsByUserController,
  searchPostsController
};
