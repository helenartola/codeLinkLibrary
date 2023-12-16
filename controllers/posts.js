import { createPost, getAllPosts, getAllPostsByUserId, deletePostById, getSinglePost } from '../DB/postsDb.js';


import { generateError } from '../helpers.js';

const getPostByUserIdController = async (req, res, next) => {
  try {
    const post = await getSinglePost();
    res.send({
      status: 'ok',
      message: post,
    });
  } catch (error) {
    next(error);
  }
};

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
};

const newPostController = async (req, res, next) => {
  try {
    const { title, url, description } = req.body;

    // Verificar si userId está presente en req
    if (!req.userId) {
      throw generateError('Usuario no autenticado', 401);
    }

    if (!title || !url || !description) {
      throw generateError('Titulo, url y texto obligatorio', 400);
    }

    // Validamos que la descripción sea una URL válida.
    if (!isValidHttpUrl(url)) {
      throw generateError('URL no válida', 400);
    }

    const postId = await createPost(title, url, description, req.userId);
    res.send({
      status: 'ok',
      message: `Post ${postId} creado con éxito!`,
    });
  } catch (error) {
    next(error);
  }
};

const getPostsByUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
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
    const { id: postId } = req.params;

// Verificar si userId está presente en req
    if (!req.userId) {
      throw generateError('Usuario no autenticado', 401);
    }

    // Obtener información del post para verificar si el usuario es el creador
    const post = await getSinglePost();

    // Verificar si el usuario es el creador del post
    if (post.userId !== req.userId) {
      throw generateError('No tienes permisos para eliminar este post.', 403);
    }

    // Eliminar el post
    await deletePostById(postId);

    res.send({
      status: 'ok',
      message: 'Post eliminado con éxito',
    });
  } catch (error) {
    next(error);
  }
};

export {
  getPostByUserIdController,
  getPostsController,
  newPostController,
  getPostsByUserController,
  deletePostController,
};
