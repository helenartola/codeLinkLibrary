import { getUserById} from '../DB/usersDb.js';

const userExists = async (req, res, next) => {
    try {
        // Intentamos obtener el usuario, si falla propagará una excepción
        await getUserById(req.userId);

        // Saltamos al controlador
        next();
    }
    catch (error) {
        next(error);
    }
};

export { userExists };