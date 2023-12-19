# Descripción del proyecto codeLinkLibrary:

Plataforma para compartir y guardar enlaces de desarrollo web.

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
