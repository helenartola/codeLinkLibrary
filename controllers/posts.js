// Importa las funciones necesarias
import {
  createPost,
  getAllPosts,
  getAllPostsByUserId,
  getSinglePost,
  deletePostById,
  likePost,
  searchPosts,
  createComment,
  getCommentsByPostId,
  savePost,
  getSavedPosts,
  unsavePost,
  deleteComment,
  editComment,
  editPost,
  getTopPosts,
  fetchCategorias,
  getPostsByCategory
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
    const { userid } = req.headers;
    console.log(JSON.stringify(req.headers));
    const { postId } = req.params;
    const post = await getSinglePost(postId, userid ? userid : 0);
      
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
    const { userid } = req.headers;
    const posts = await getAllPosts(userid ? userid : 0);
    
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
    const { title, url, description, categoryId } = req.body;

    if (!req.userId) {
      throw generateError('Usuario no autenticado', 401);
    }

    if (!title || !url || !description) {
      throw generateError('Titulo, url y texto obligatorio', 400);
    }

    if (!isValidHttpUrl(url)) {
      throw generateError('URL no válida', 400);
    }

    const postId = await createPost(title, url, description, req.userId, categoryId);
    res.send({
      status: 'ok',
      data: postId,
      categoryId,
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

// Controlador para guardar un post
const savePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId; 

    // Lógica para guardar el post
    await savePost(userId, postId);

    res.send({
      status: 'ok',
      data: 'Post guardado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener posts guardados por un usuario
const getSavedPostsController = async (req, res, next) => {
  try {
    const userId = req.userId; 

    // Lógica para obtener los posts guardados por el usuario
    const savedPosts = await getSavedPosts(userId);

    // Verifica si no se encontraron posts guardados
    if (!savedPosts || savedPosts.length === 0) {
      // Si no hay posts guardados, devuelve un mensaje indicando esto
      return res.status(200).send({
        status: 'ok',
        message: 'No se encontraron posts guardados para este usuario',
      });
    }

    // Si se encontraron posts guardados, devuelve los posts
    res.send({
      status: 'ok',
      data: savedPosts,
    });
  } catch (error) {
    next(error);
  }
};


// Controlador para eliminar un post guardado por un usuario
const unsavePostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    // Llamamos a la función para eliminar el post guardado
    await unsavePost(userId, postId);

    res.send({
      status: 'ok',
      data: 'Post eliminado de favoritos con éxito',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para eliminar un comentario de un post
const deleteCommentController = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userId;

    // Lógica para eliminar el comentario
    await deleteComment(postId, commentId, userId);

    res.send({
      status: 'ok',
      data: 'Comentario eliminado con éxito',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para editar un post específico
const editPostController = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, url, description } = req.body;

    // Lógica para editar el post con los nuevos datos proporcionados
    await editPost(postId, title, url, description);

    res.send({
      status: 'ok',
      data: 'Post editado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para editar un comentario específico
const editCommentController = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    // Lógica para editar el comentario con los nuevos datos proporcionados
    await editComment(commentId, text);

    res.send({
      status: 'ok',
      data: 'Comentario editado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

// Controlador para obtener los posts más votados
const getTopPostsController = async (req, res, next) => {
  try {
    const topPosts = await getTopPosts();
    res.send({
      status: 'ok',
      data: topPosts,
    });
  } catch (error) {
    next(error);
  }
};


//Controlador obtener listado de gategorias
const getCategoriasController = async (req, res) => {

  try {
      const categorias = await fetchCategorias();
      
      // Enviamos respuesta con el listado de categorías
      res.status(200).send({
          status: "ok",
          message: "Listado categorías. ✅",
          data: categorias,
      });
  } catch (error) {
      // Enviamos un error 500 en caso de error interno del servidor
      res.status(500).send({
          status: "error",
          message: error.message || "Error interno del servidor al obtener categorías.🔴"
      });
  }
};

//Controlador obtener todos lost post de una gategoria
const getPostsByCategoriasController = async (req, res) => {

  try {
         // Obtener la ID de la categoría desde los parámetros de la solicitud
    const { categoriaId } = req.params;

    // Llamar a la función que obtiene los posts de la categoría
    const PostsCategorias = await getPostsByCategory(categoriaId);
    console.log('PostsCategorias:', PostsCategorias)
      // Enviamos respuesta con el listado de posts de una categoría
      res.status(200).send({
          status: "ok",
          message: "Posts de la categoría. ✅",
          data: PostsCategorias,
          categoriaId,

      });
  } catch (error) {
      // Enviamos un error 500 en caso de error interno del servidor
      res.status(500).send({
          status: "error",
          message: error.message || "Error interno del servidor al obtener lost posts de esta categoría.🔴"
      });
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
  savePostController,
  getSavedPostsController,
  unsavePostController,
  deleteCommentController,
  editPostController,
  editCommentController,
  getTopPostsController,
  getCategoriasController,
  getPostsByCategoriasController
};
