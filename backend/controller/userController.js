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


// Test Cases for User Controller:
// Create User:

// Description: Test user registration.
// Request: Send a POST request to user creation endpoint with user details.
// Expected Result: Response status is 201 with user data and token.
// Add Profile to User:

// Description: Test adding a profile to an existing user.
// Request: Send a POST request to add a profile with profile details.
// Expected Result: Response status is 201, and the user data with the new profile is returned.
// Get User by ID:

// Description: Test retrieving a user by ID.
// Request: Send a GET request to the user retrieval endpoint with a specific user ID.
// Expected Result: Response status is 200 with the user's data.
// Update User:

// Description: Test updating a user's details.
// Request: Send a PUT request to the user update endpoint with updated user details.
// Expected Result: Response status is 200 with updated user data.
// Delete User:

// Description: Test deleting a user.
// Request: Send a DELETE request to the user deletion endpoint with a specific user ID.
// Expected Result: Response status is 200 with a 'User removed' message.