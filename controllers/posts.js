import {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  getPostByUserIdAndPostId,
  getSinglePost,
  deletePostById,
  likePost,
} from '../DB/postsDb.js';

import { generateError } from '../helpers.js';

//Función que maneja las solicitudes para obtener un solo post por ID de usuario.

const getPostByUserController = async (req, res, next) => {
  try {
    const { userId, postId } = req.params;

    const post = await getPostByUserIdAndPostId(userId, postId);

    if (!post) {
      throw generateError(`No se encontró el post con ID ${postId} para el usuario con ID ${userId}`, 404);
    }

    res.send({
      status: 'ok',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};


//Función que maneja las solicitudes para obtener todos los posts.

const getPostsController = async (req, res, next) => {
  try {
    const posts = await getAllPosts(req.query.today);
    res.send({
      status: 'ok',
      data: posts,
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
      data: postId
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

    if (!posts || posts.length === 0) {
      //Si no hay post del usuario lanzamos un error 404.
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

//Función que maneja las solicitudes para eliminar un post.

const deletePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;

    //Obtener información del post para verificar si el usuario es el creador del post.
    const post = await getSinglePost(postId);

    //Verifica si el usuario es el creador del post.
    if (post.userId != req.userId) {
      throw generateError('No tienes permisos para borrar este post', 401);
    }
    //Eliminar el post.
    await deletePostById(postId);
    res.send({
      status: 'ok',
      data: 'Post eliminado con éxito',
    });
  } catch (error) {
    next(error);
  }
};

const likePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; // Suponiendo que ya has autenticado al usuario.

    const post = await getSinglePost(postId);
    //El usuario no puede dar likes a su propio post
    if (post.userId == req.userId) {
      throw generateError('No puedes dar like a tu propio post', 401);
    }
    const { numLikes, isLiked } = await likePost(userId, postId);
    res.status(200).json({
      status: 'ok',
      message: 'Operacion correcta',
      data: {
        numLikes,
        isLiked,
      },
    });
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
  likePostController,
};
