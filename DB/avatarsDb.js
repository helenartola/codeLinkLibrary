// Importa la conexión a la base de datos
import getConnection from './getPool.js';

// Función para obtener la URL del avatar por el ID del usuario
const getAvatarUrlByUserId = async (userId) => {
  let connection;

  try {
    connection = await getConnection();

    // Consulta SQL para obtener la URL del avatar
    const query = 'SELECT avatarUrl FROM avatars WHERE userId = ?';
    const [result] = await connection.query(query, [userId]);

    // Si no se encuentra la URL del avatar, devolver null o manejar según sea necesario
    if (result.length === 0) {
      return null;
    }

    return result[0].avatarUrl;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

export { getAvatarUrlByUserId };


// Función para obtener todas las URLs de avatares desde la base de datos.
const getAllAvatars = async () => {
    let connection;
  
    try {
      connection = await getConnection();
  
      // Obtenemos todas las URLs de avatares
      const avatars = await connection.query('SELECT * FROM avatars');
  
      return avatars;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      if (connection) connection.release();
    }
  };
  
  export { getAllAvatars };