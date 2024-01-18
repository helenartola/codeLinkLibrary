// Importamos .env (variables de entorno)
import 'dotenv/config';

// Importamos express
import express from 'express';

// Middleware morgan que imprime en terminal el tiempo de petición
import morgan from 'morgan';

// Importamos las funciones que hemos creado en users.js
import {
  newUserController,
  getAllUsersController,
  getUserController,
  loginController,
  deleteUserController,
} from './controllers/users.js';

// Importamos las funciones que hemos creado en posts.js
import {
  getPostsController,
  newPostController,
  deletePostController,
  getPostsByUserController,
  getPostByUserController,
  likePostController
} from './controllers/posts.js';

// Importamos el middleware de autenticación
import { authUser } from './middlewares/auth.js';

// Importamos el middleware para verificar la existencia del usuario
import { userExists } from './middlewares/userExists.js';

// Creacion del servidor con express
const app = express();

// Le decimos a express que intente procesar los datos que se envíen en la petición en formato json.
app.use(express.json());

// Middleware morgan para imprimir en la terminal el tiempo de petición
app.use(morgan('dev'));

// Rutas de usuarios
app.post('/user', newUserController); // Crear un nuevo usuario
app.get('/users', authUser, userExists, getAllUsersController); // Obtener todos los usuarios autenticados
app.get('/user/:id', authUser, userExists, getUserController); // Obtener un usuario específico
app.post('/login', loginController); // Iniciar sesión
app.delete('/user', authUser, userExists, deleteUserController); // Eliminar un usuario y manejar el token

// Rutas de posts
app.get('/posts', getPostsController); // Obtener todos los posts de todos los usuarios
app.get('/posts/user/:id', getPostsByUserController); // Obtener todos los posts de un usuario
app.get('/posts/:postId', getPostByUserController); // Obtener un post específico de un usuario
app.post('/post', authUser, userExists, newPostController); // Crear un nuevo post
app.delete('/post/:postId', authUser, userExists, deletePostController); // Eliminar un post y manejar el token
app.post('/post/:postId/like', authUser, userExists, likePostController); // Dar "like" a un post y manejar el token

// Middleware de ruta no encontrada
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    data: 'Ruta no encontrada',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    data: error.message,
  });
});

// Puerto desde donde se escuchan peticiones
app.listen(8000, () => {
  console.log(`Servidor escuchando en http://localhost:8000`);
});
