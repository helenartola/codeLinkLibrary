//importamos .env (variables de entorno)
import 'dotenv/config';
//importamos express
import express from 'express';
//middleware morgan que imprime en terminal el tiempo de petición
import morgan from 'morgan';

// Importamos las funciones que hemos creado en el users.js
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
  //likePostController
} from './controllers/posts.js';

// Importamos las funciones que hemos creado en auth.js
import { authUser } from './middlewares/auth.js';

//creacion del servidor con express
const app = express();
//le decimos a express que intente procesar los datos que se envien en la petición en formato json.
app.use(express.json());
app.use(morgan('dev'));

//Rutas de usuarios (cada ruta tendrá que gestionar un controlador)
//Las funciones newUserController, getUser... las creamos dentro del archivo users.js de la carpeta controllers. Y luego las importamos aquí.
app.post('/user', newUserController);
app.get('/users', authUser, getAllUsersController);
app.get('/user/:id', authUser, getUserController);
app.post('/login', loginController);
app.delete('/user/:id', authUser, deleteUserController);

//Rutas de posts
app.get('/', getPostsController); //Devuelve todos los posts de todos los usuarios
app.get('/posts/:id', getPostsByUserController); //Devuelve todos los posts de un único usuario
app.get('/user/:userId/post/:postId', getPostByUserController); //Nos devuelve un post concreto de un usuario en concreto
app.post('/', authUser, newPostController); //Crea un post
app.delete('/post/:postId', authUser, deletePostController); //Borramos un post concreto de un usuario concreto

/* // Nuevas rutas para "Likes"
app.post('/post/:postId/like', authUser, likePostController); */

//middleware que crea post en base de datos
app.post('/posts', (req, res) => {
  res.status(201).send({
    status: 'ok',
    message: 'Post creado',
  });
});

//middleware de ruta no encontrada
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Ruta no encontrada',
  });
});

//middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

//puerto desde donde se escuchan peticiones
app.listen(8000, () => {
  console.log(`Servidor escuchando en http://localhost:8000`);
});
