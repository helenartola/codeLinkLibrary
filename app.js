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
  getPostByUserIdController,
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
app.get('/users', getAllUsersController);
app.get('/user/:id', getUserController);
app.post('/login', loginController);
app.delete('/user/:id', authUser, deleteUserController);

//Rutas de posts
app.get('/', getPostsController);//nos devuelve todos los posts
app.get('/posts/:id', getPostsByUserController);//posts del usuario
app.get('/post/:id', getPostByUserIdController);//añadimos ruta para post por usuario ID
app.post('/', authUser, newPostController);//crea post
app.delete('/post/:id', authUser, deletePostController);//borramos un post del usuario

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
