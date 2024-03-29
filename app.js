// Importa las configuraciones de las variables de entorno
import 'dotenv/config';

// Importa el framework Express
import express from 'express';

// Importa el middleware Morgan para el registro de solicitudes HTTP
import morgan from 'morgan';

// Importa el paquete CORS para permitir solicitudes desde diferentes dominios
import cors from 'cors';

// Importa las funciones controladoras del usuario desde users.js
import {
  newUserController,
  getAllUsersController,
  getUserController,
  loginController,
  userSettingsController,
  deleteUserController,
} from './controllers/users.js';

// Importa las funciones controladoras de los posts desde posts.js
import {
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
  getPostsByCategoriasController,
} from './controllers/posts.js';


// Importa el middleware de autenticación
import { authUser } from './middlewares/auth.js';

// Importa el middleware para verificar la existencia del usuario
import { userExists } from './middlewares/userExists.js';

// Crea la instancia de Express
const app = express();

// Middleware CORS para permitir solicitudes desde diferentes dominios
app.use(cors());

// Configura Express para procesar datos en formato JSON
app.use(express.json());

// Middleware Morgan para el registro de solicitudes HTTP
app.use(morgan('dev'));

// Rutas relacionadas con los usuarios
app.post('/user/register', newUserController); // Crea un nuevo usuario
app.post('/users/login', loginController); // Inicia sesión
app.patch('/settings', authUser, userExists, userSettingsController); // Ajustes de usuario
app.delete('/user/:id', authUser, userExists, deleteUserController); // Elimina un usuario y maneja el token
app.get('/user/:id', authUser, userExists, getUserController); // Obtiene un usuario específico
app.get('/users', authUser, userExists, getAllUsersController); // Obtiene todos los usuarios autenticados


// Rutas relacionadas con los posts
app.post('/post', authUser, userExists, newPostController); //Crea un nuevo post
app.get('/posts/:postId', getPostController); //Obtiene un post específico de un usuario
app.get('/posts/user/:id', getPostsByUserController); //Obtiene todos los posts de un usuario
app.get('/post/search', searchPostsController); //Devuelve todos los posts que coinciden con la búsqueda
app.get('/posts', getPostsController); //Devuelve todos los posts de todos los usuarios
app.put('/post/:postId', authUser, userExists, editPostController); //Editar un post
app.delete('/post/:postId', authUser, userExists, deletePostController); //Elimina un post 
app.post('/post/:postId/comments', authUser, userExists, createCommentController); //Crea comentarios en un post
app.get('/post/:postId/comments', getCommentsByPostIdController); //Devuelve todos los comentarios del post
app.put('/post/comment/:commentId', authUser, userExists, editCommentController); //Editar un comentario
app.delete('/post/:postId/comment/:commentId', authUser, userExists, deleteCommentController); //Elimina un comentario
app.post('/post/:postId/like', authUser, userExists, likePostController); //Da "like" a un post 
app.get('/top', getTopPostsController);//Obtiene post más votados.
app.post('/post/:postId/save', authUser, userExists, savePostController); //Guarda un post 
app.get('/saved', authUser, userExists, getSavedPostsController); // Obtiene todos los posts guardados por un usuario
app.delete('/post/:postId/unsave', authUser, userExists, unsavePostController); //Eliminar un guardado en un post.

//Rutas relacionadas con categorias
app.get('/categorias', getCategoriasController); //Obtiene todas las categorias.
app.get('/categorias/:categoriaId/posts', getPostsByCategoriasController);//Obtiene todos los posts de una categoria.

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    data: 'Ruta no encontrada',
  });
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    data: error.message,
  });
});

// Puerto donde el servidor escucha las solicitudes
app.listen(8000, () => {
  console.log(`Servidor escuchando en http://localhost:8000`);
});