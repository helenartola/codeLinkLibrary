import jwt from 'jsonwebtoken';
import { generateError } from "../helpers.js";

const authUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw generateError('Falta la cabecera de Authorization', 401);
        }

        // Comprobamos que el token es correcto
        let token;

        try {
            token = jwt.verify(authorization, process.env.SECRET)
        }
        catch {
            throw generateError('Token incorrecto', 401);
        }

        // Metemos la información del token en la request para usarla en el controlador
        req.userId = token.userId;
        
        // Saltamos al controlador
        next();
    }
    catch (error) {
        next(error);
    }
};

export { authUser };
