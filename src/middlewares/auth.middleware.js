// Modules
import dotenv from "dotenv"; 
import jwt from "jsonwebtoken";
import userService from "../services/user.service.js";

// Settings
dotenv.config();

export const authMiddleware = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            res.sendStatus(401);
        }

        const parts = authorization.split(" ");
    
        if (parts.length !== 2) {
            return res.sendStatus(401);
        }

        const [schema, token] = parts; 
    
        if (schema !== "Bearer") {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
            if (error) {
                return res.status(401).send({ message: "Invalid token!" })
            }

            const user = await userService.findByIdService(decoded.id);
    
            if (!user || !user.id) {
                return res.status(401).send({ message: "Invalid token!" });
            }
    
            req.userId = user.id;
            return next();
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};