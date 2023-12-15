
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

// Test Cases for Auth Controller:
// Login User:

// Description: Test if a user can log in with valid credentials.
// Request: Send a POST request to /login with valid email and password.
// Expected Result: Response status is 200 with user data and token.


// Invalid Login:

// Description: Test login with invalid credentials.
// Request: Send a POST request to /login with incorrect email or password.
