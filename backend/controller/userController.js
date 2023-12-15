import User from "../models/users.js";
import generateToken from "../utilities/tokenGeneration.js";


export const createUser = async (req, res) => {
    const { name, email, password, role, age } = req.body;

    // SERVER SIDE EMAIL VALIDATION!!!
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    try {
      // Checking if user already exists based on the emails available in collections
      const userExists = await User.findOne({ email });
      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }
  
      const user = new User({
        name,
        email,
        password, 
        role: role || 'subscriber',  // Default role is 'subscriber' unless explicitly mentioned 
        age,
        profiles: [{ profileName: name, age: age }] // as the user himself is an profile
      });
  
      const createdUser = await user.save();
      const token = generateToken(createdUser._id, createdUser.role);
      
      res.status(201).json({
                user: createdUser.toJSON(),
                token: token
            });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const addProfileToUser = async (req, res) => {
    const { name, age } = req.body;
    

    try {
      const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        if (user.profiles.length >= 4) {
            return res.status(400).json({ message: 'Maximum number of profiles reached' });
        }

        
        user.profiles.push({ profileName:name, age });
        
        const updatedUser = await user.save();
        res.status(201).json(updatedUser.toJSON());

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getUserProfiles = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user.profiles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const updateUser = async (req, res) => {
    const { name, email, password, age } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.age = age || user.age;

        if (password) {
            user.password = password;
        }

        const updatedUser = await user.save();
        res.json(updatedUser.toJSON());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        await user.remove();
        res.json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
