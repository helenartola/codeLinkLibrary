import {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  deletePostByUserIdAndPostId,
  getPostByUserIdAndPostId,
  likes,
  getLikesByUserAndPost
} from '../DB/postsDb.js';

import { generateError } from '../helpers.js';

//Función que maneja las solicitudes para obtener un solo post por ID de usuario.

const getPostByUserController = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    // Puedes usar las funciones específicas para obtener un post por ID de usuario y ID de post
    const post = await getPostByUserIdAndPostId(userId, postId);

    if (!post) {
      return res.status(404).send({
        status: 'error',
        message: 'Post not found',
      });
    }

    res.send({
      status: 'ok',
      message: post,
    });
  } catch (error) {
    next(error);
  }
};

//Función que maneja las solicitudes para obtener todos los posts.

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

// Función que comprueba que la url sea válida.

const isValidHttpUrl = (string) => {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch {
    return false;
  }
};

//Función que maneja las solicitudes para crear un nuevo post.
// Verifica si el usuario está autenticado, y valida los datos del post antes de crearlo.
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

//Función que maneja las solicitudes para obtener todos los posts asociados a un usuario específico, identificado por su ID.

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

//Función que maneja las solicitudes para eliminar un post.

const deletePostController = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    const postDeleted = await deletePostByUserIdAndPostId(userId, postId);

    if (postDeleted) {
      res.send({
        status: 'ok',
        message: 'El post se ha borrado!',
      });
    } else {
      res.status(404).send({
        status: 'error',
        message: 'No se ha encontrado el post o no se ha podido borrar',
      });
    }
  } catch (error) {
    next(error);
  }
};

  const likePostController = async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user.userId; // Suponiendo que ya has autenticado al usuario.

  try {
    // Verifica si el usuario ya ha dado "Like" al post.
    const existingLikes = await getLikesByUserAndPost(userId, postId);

    if (existingLikes.length === 0) {
      // Si no ha dado "Like", le permite dar "Like".
      await likes(userId, postId);

      res.status(201).json({
        status: 'ok',
        message: 'Like agregado con éxito.',
      });
    } else {
      // Si ya ha dado "Like", puedes manejarlo de acuerdo a tus necesidades.
      res.status(400).json({
        status: 'error',
        message: 'El usuario ya ha dado like a este post.',
      });
    }
  } catch (error) {
    next(error);
  }
};

//Exportamos todas las funciones definidas.

export {
  getPostByUserController,
  getPostsController,
  newPostController,
  getPostsByUserController,
  deletePostController,
  likePostController
};
