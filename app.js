//importamos .env (variables de entorno)
import 'dotenv/config';
//importamos express
import express from 'express';
//importamos morgan
import morgan from 'morgan';

//creacion del servidor con express
const app = express();

app.use(morgan('dev'));

//middleware (peticiones) qe muestra el metodo y la ruta (endpoint) de la peticion
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  //pasamos al siguiente middleware
  next();
});

//middleware que devuelve los posts de la base de datos
app.get('/posts', (req, res) => {
  res.send({
    status: 'ok',
    message: 'Aqui tines el listado de posts',
  });
});

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
app.listen(3306, () => {
  console.log(`Servidor escuchando en http://localhost:3306`);
});
