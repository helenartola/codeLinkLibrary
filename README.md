# CODELINKLIBRARY APP

## DESCRIPCIÓN DEL PROYECTO:

    El equipo D conformado por Ana, tony y Helena hemos desarrollado una plataforma para compartir y guardar enlaces de desarrollo web.

## CARACTERÍSTICAS:

    - Registro, login y eliminación de usuario.
    - Creación y eliminación de post.
    - Posibilidad de dar like a post.
    - visibilización de post general.
    - Visibilización de post concreto.

## CONFIGURACIÓN INICIAL DEL PROYECTO:

1. Creamos repositorio en github.

2. Clonamos repositorio de github en una carpeta nueva en el pc (code-link-library ejemplo) con el comando `git clone` + `url de repositorio en github`.

3. Iniciamos proyecto con el comando `npm init -y`.
4. Instalamos dependencias con `npm install` o `npm i` (+ `express, dotenv, mysql2, jsonwebtoken, bcryptjs, morgan, joi, cors`).

5. Modificamos el módulo `package.json` (`"type":"module"` añadimos el primero), modificamos values de (`"name"`, `"description"`, `"main"`) y dentro de `"scripts"` incluimos `"dev": "lo que se necesite"` para tareas especificas del desarrollo.

6. Utilizamos el comando `npm run dev` despues de configurar el script dev.

7. Creamos modulo README.md con `touch README.md` (Descripción app).

8. Creamos estructura básica de carpetas(`DB`, `controllers`, `middlewares`, `services`).

9. Creamos módulo principal `app.js`.

10. Creamos módulo ocultación archivos con `touch .gitignore`.

11. Configuramos variables de entorno en un archivo `.env`. (incluimos en `.gitignore`)

12. Creamos archivo de referencia `.env.example`. (dejamos solo datos de muestra)

13. Creamos Pool de conexiones en db/`getPool.js`.

14. Creamos la bd remoto a MySQL en db/`initDb.js`.

15. Creamos en db/`postsDb.js`.

16. Creamos en db/`usersDb.js`.

17. Creamos middleware de JWT en middlewares/`Auth.js`.

18. Creamos `Helpers.js`.

19. Creamos en services `users.services.js`

20. Creamos controlers para programar el funcionamiento de la app de notas.

21. Creamos rutas/Endpoints (para los controllers).

22. Configuramos endpoints en Postman (se hacen de uno en uno, incluiremos el archivo para los compañeros).

23. Incluimos archivo del postman en el repositorio (`codelinklibrary_Api.postan_collection.son`).

24. Realizamos pruebas de funcionamiento (una vez tenemos el mensaje de confirmación `Servidor corriendo en el puerto 4000`).

## DEPENDENCIAS:

    - express           (Agrega los módulos package.json y package-lock.json)    (El primero!!)
    - dotenv            (Acceder al archivo .env)
    - mysql2            (Manejador la base de datos)
    - jsonwebtoken      (Manejador del usuario / JWT)
    - bcrypt            (Encriptador)
    - morgan            (Registrador de solicitudes HTTP)
    - joi               (Validador exquemas de datos)
    - cors              (Gestor de solicitudes HTTP / Middleware)

## ENDPOINTS

- **USUARIOS**

  - **POST** Registro de usuario
  - **POST** Login de usuario
  - **DELETE** Eliminación de usuario

- **PUBLICACIONES**

  - **POST** Crea un post de un usuario
  - **DELETE** Elimina un post de un usuario

- **LIKES**

  - **POST** Añade un like a un post

- **CONSULTAS**

  - **GET** Devuelve todos los usuarios
  - **GET** Devuelve un usuario
  - **GET** Devuelve todos los post de todos los usuarios
  - **GET** Devuelve todos los post de un usuario
  - **GET** Devuelve un post de un usuario

## Uso

    Para ejecutar el proyecto:

- En la terminal / bash usar comando `node index.js` o `npm run dev`.

# Comandos útiles

- Para revisar dependencias instaladas `npm list`.
- Para revisar dependencias instaladas de primer nivel `npm list --depth=0`.
- Para revisar dependencias en busca de vulnerabilidades conocidas utiliza `npm audit`.
