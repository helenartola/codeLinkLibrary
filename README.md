# Descripción del proyecto codeLinkLibrary:

Plataforma para compartir y guardar enlaces de desarrollo web.

# Características de la entrega

· La entrega debe hacerse antes del martes 19/12/23 a las 18:00 a mi e-mail (stefano. peraldini@hackaboss.com). Lo tenéis en el calendario.

· Para este proyecto únicamente tenéis que enviarme el link al repositorio.

· En los pdf:
hay una sencilla descripción de una plataforma, vosotros tendréis que implementar solo el Backend/API. Nada de HTML y CSS, el Front lo haremos en el proyecto 3 con React.

· Cuando se habla de usuario anónimo se entiende una persona que usa la plataforma sin hacer login.

· Todos los miembros del equipo debéis tener commits y aparecer como colaboradores en el repositorio.

· Dentro del repositorio debe haber un archivo initDB.js que genere la estructura de la base de datos (no es necesario que incluya datos).

· El repositorio también debe incluir la colección de Postman con todos los endpoints correctamente construidos (con su body en caso de necesitarlo)

· Aquí os dejo el vídeo de cómo crear y exportar una colección de postman:
https://www.loom.com/share/5933cf4ace734702951450a273995e47?sid=77801fe8-f9e6-47de-a0e7-4cdbd82879c8

· Podéis pedir tutorías, aunque concretamente para el proyecto solamente se darán durante la semana que viene y hasta el día de la entrega.

· PD: el vídeo del prework de la semana 13 puede ser de gran ayuda.

# Comandos para saber en que rama estamos

-- Para saber en que rama estamos -> git branch
-- Para cambiar de rama -> git checkout nombre-de-la-rama
-- Para ver si estamos en la rama que queremos una vez hecho el checkout -> git branch

# Comandos para realizar commit, push y pull desde la terminal

**Paso 1 · git status**

-- Para saber qué cambios hemos realizado (estando en la rama escogida) -> git status
------ _Ejemplo de lo que sale si tenemos cambios:_
------ git status
------ On branch Helena (_Nos está diciendo que estamos en la rama Helena_)
------ Changes not staged for commit: (_Nos dice los cambios no preparados para confirmación:_)
------ (use "git add <file>..." to update what will be committed)
------ (use "git restore <file>..." to discard changes in working directory)
------ modified: README.md (_Nos indica que archivos tienen cambios_)

------------ no changes added to commit (use "git add" and/or "git commit -a") (_Nos indica el siguiente paso_)

**Paso 2 · git add . / git add nombre-del-archivo-concreto**

-- Comando para añadir los cambios -> git add .
----------(_Al poner el . le estamos diciendo que añada todos los cambios que haya en cualquier archivo_)

-- Comando para añadir los cambios de un archivo en concreto -> git add README.md

**Paso 3 · Hacer commit con git commit -m "Mensaje descriptivo del commit"**

-- Para realizar un commit -> git commit -m "Mensaje descriptivo del commit"

**Paso 4 · Hacer push con git push origin nombre-de-la-rama**
-- Para realizar un push -> git push origin Helena
----------(_en este caso lo estamos subiendo a la rama Helena donde estamos trabajando_)

**Si no nos funciona el push puede ser por no tener la llave SSH vinculada a github**

---------- Puede que nos salga este mensaje: _git@github.com: Permission denied (publickey)\_.
**Paso 1 · Vincular la llave SSH**
-- Nos aseguramos de que la clave SSH esté correctamente configurada en el sistema y asociada con la cuenta de GitHub. Podemos verificar las claves SSH existentes con el siguiente comando -> ls -al ~/.ssh

**Paso 2 · Si tenemos la llave configurada debemos agregarla a ssh-agent**

-- Agregar la clave SSH a ssh-agent -> ssh-add ~/.ssh/nombre-de-la-llave

**Paso 3 · Verificamos la configuración remota:**

-- Verificamos la configuración remota con -> git remote -v
---------- Esto mostrará las URLs de las configuraciones remotas. Asegúrate de que la URL de tu remoto sea de la forma: git@github.com:usuario/nombre-repositorio.git

**Paso 4 · Intenta hacer el push otra vez:**

-- git push origin nombre-de-la-rama

**Hacer un pull - Descargar los cambios**
Asegúrate de estar en la rama donde quieres descargar los cambios -> git checkout nombre-de-la-rama

Realiza el pull desde la rama remota main -> git pull origin main

# Hoja de ruta para el proyecto

**Configuración inicial del proyecto:**

- Abrimos el proyecto `code .` en la terminal para abrir el directorio actual en VS Code.

**Configuramos extensiones:**

- npm i / npm install: express, dotenv, mysql2, nodemon...

**Definimos la BDD:**

- Definimos tablas y su contenido para la base de datos.

**Manejo de errores:**

- Definimos posibles errores

**Postman:**

- Creamos colecciones postman

# Endpoints

Registro y Autenticación:

POST /api/signup: Registro de un nuevo usuario.
POST /api/login: Inicio de sesión de un usuario.

Enlaces Compartidos:

GET /api/links: Obtener todos los enlaces compartidos (públicos o privados) por los usuarios.
GET /api/links/:userId: Obtener enlaces específicos compartidos por un usuario.
POST /api/links: Compartir un nuevo enlace.
PUT /api/links/:linkId: Actualizar información de un enlace compartido.
DELETE /api/links/:linkId: Eliminar un enlace compartido.

Usuarios:

GET /api/users: Obtener información de todos los usuarios.
GET /api/users/:userId: Obtener información específica de un usuario.
PUT /api/users/:userId: Actualizar información de un usuario.
DELETE /api/users/:userId: Eliminar un usuario.

Likes:

POST /api/like/:linkId: Dar un "like" a un enlace específico.
DELETE /api/like/:linkId: Quitar el "like" de un enlace específico.
GET /api/like/:linkId/count: Obtener la cantidad total de "likes" para un enlace específico.

Búsqueda ?:

GET /api/search?q=query: Realizar una búsqueda de enlaces o usuarios basada en una consulta.
