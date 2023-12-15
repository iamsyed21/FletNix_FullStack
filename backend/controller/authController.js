
import User from '../models/users.js';
import generateToken from '../utilities/tokenGeneration.js';



export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPasswords(password))) {
            const token = generateToken(user._id, user.role);
            res.status(200).json({
                user: user.toJSON(),
                token: token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};