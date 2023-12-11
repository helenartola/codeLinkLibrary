//importamos .env (variables de entorno)
import "dotenv/config";

//imporrtamos express
import express from "express";

//creacion del servidor con express
const app = express();

//middleware (peticiones) qe muestra el metodo y la ruta (endpoint) de la peticion
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  //pasamos al siguiente middleware
  next();
});

//middleware que devuelve los posts de la base de datos
app.get("/posts", (req, res) => {
  res.send({
    status: "ok",
    message: "Aqui tines el listado de posts",
  });
});

//middleware que crea post en base de datos
app.post("/posts", (req, res) => {
  res.status(201).send({
    status: "ok",
    message: "Post creado",
  });
});

//middleware de ruta no encontrada
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Ruta no encontrada",
  });
});

//puerto desde donde se escuchan peticiones
app.listen(3306, () => {
  console.log(`Servidor escuchando en http://localhost:3306`);
});
