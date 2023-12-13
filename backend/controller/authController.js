import jwt from 'jsonwebtoken';
import User from '../models/users.js';
import generateToken from '../utilities/tokenGeneration.js';



export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPasswords(password))) { 
            generateToken(res, user._id, user.role);
            res.status(200).json(user.toJSON());
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
