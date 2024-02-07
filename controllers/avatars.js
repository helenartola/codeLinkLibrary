// Importa la función para obtener la URL del avatar
import { getAvatarUrlByUserId } from '../DB/avatarsDb.js'; // Asegúrate de tener la lógica correspondiente en tu archivo
import { getAllAvatars } from '../DB/avatarsDb.js';

const getUserAvatarController = async (req, res, next) => {
  try {
    // Obtén el userId del token
    const userId = req.userId;

    // Obtén la URL del avatar del usuario desde la base de datos
    const avatarUrl = await getAvatarUrlByUserId(userId);

    // Responde con la URL del avatar
    res.send({
      status: 'ok',
      data: {
        avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getUserAvatarController };

const getAllAvatarsController = async (req, res, next) => {
    try {
      const avatars = await getAllAvatars();
      res.send({
        status: 'ok',
        data: avatars,
      });
    } catch (error) {
      next(error);
    }
  };
  
  export { getAllAvatarsController };