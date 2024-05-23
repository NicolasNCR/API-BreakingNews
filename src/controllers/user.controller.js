// Modules
import bcrypt from 'bcrypt';
import { generateToken } from '../services/auth.service.js'
import userService from '../services/user.service.js'

const create = async (req, res) => {
    try {
        const {name, username, email, password, avatar, background} = req.body;

        if (!name || !username || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "Submit all fields for registration" });
        }

        const user = await userService.createService(req.body);

        if (!user) {
            return res.status(400).send({ message: "Error creating User" })
        }

        const token = generateToken(user.id);

        res.status(201).send({
            message: "User created successfully",
            token
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findAll = async (req, res) => {
    try {
        const users = await userService.findAllService();

        if (users.length === 0){
            return res.send(400).send({ message: "There are no registered users" });
        }

        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const findById = async (req, res) => {
    try {
        // const user = await userService.findByIdService(
        //     req.params.id,
        //     req.userId
        //   ); 
        let idParam;
        let userIdParam = req.params.id;
        let userIdLogged = req.userId;

        // console.log(userIdLogged)

        if (!userIdParam) {
            userIdParam = userIdLogged;
            idParam = userIdParam;
        } else {
            idParam = userIdParam;
        }

        if (!idParam) {
            res.send({ message: "Send an id in the parameters to search for the user" })
        }
        
        const user = await userService.findByIdService(idParam);

        if (!user) {
            res.send({ message: "User not found" })
        } 


        // ORIGINAL
        // const user = req.user;
    
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const update = async (req, res) => {
    try {
        const {name, username, email, password, newPassword, avatar, background} = req.body;

        if (!name && !username && !email && !password && !avatar && !background && !newPassword) {
            res.status(400).send({message: "Submit at least one field for update!"});
        }

        const { id, user } = req;

        if (password && newPassword) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).send({message: "Current password is incorrect"});
            }

            // Hash the new password before saving
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(newPassword, salt);
        }
        
        await userService.updateService(
            id,
            name,
            username,
            email, 
            req.body.password, // password
            avatar,
            background
        );

        res.send({ message: "User successfully updated" })
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export default { create, findAll, findById, update };