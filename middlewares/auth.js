import jwt from 'jsonwebtoken';
import { generateError } from "../helpers.js";

// Autenticar al usuario mediante token de autorización.
const authUser = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw generateError('Falta la cabecera de Authorization', 401);
        }

        // Imprime el token en la consola
        console.log('Authorization Token:', authorization);

        // Comprobamos que el token es correcto
        let token;

        try {
            token = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            console.error('Error decoding token:', error);

            const errorMessage = error.message || 'Token incorrecto';
            throw generateError(errorMessage, 401);
        }

        // Metemos la información del token en la request para usarla en el controlador
        req.userId = token.userId;
        
        // Saltamos al controlador
        next();
    } catch (error) {
       
        console.error('Error en authUser middleware:', error.message);
        next(error);
    }
};

export { authUser };