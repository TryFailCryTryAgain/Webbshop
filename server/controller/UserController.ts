import { Request, Response } from 'express';
import { User } from '../model/UserModel';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { addToBlacklist } from '../utils/tokenBlacklist';
import { AuthRequest } from '../middleware/auth';

const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Error fetching users ", error: err})
    }
};

const getUsersByFirstName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name } = req.params;
        if (!first_name) {
            res.status(400).json({ first_name: "First_name params is required "});
        }
        const user = await User.find({ first_name });
        if (!user) {
            res.status(404).json({ message: "No users found with that name! "});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching user "});
    }
}

const getUsersByLastName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { last_name } = req.params;
        if (!last_name) {
            res.status(400).json({ first_name: "First_name params is required "});
        }
        const user = await User.find({ last_name });
        if (!user) {
            res.status(404).json({ message: "No users found with that name! "});
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching user ", error: err });
    }
}

const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
        }
        const user = await User.findOne({ _id });
        if (!user) {
            res.status(404).json({ message: "No user found with that ID" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Error Fetching User", error: err })
    }
}



// Add JWT Authentication when it comes to creating a password
const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, tel, email, password, adress, ZIP } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with this email "});
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long"});
        }

        const newUser = new User({
            first_name,
            last_name,
            tel,
            email,
            password,
            adress,
            ZIP,
        });

        await newUser.save();


        const token = generateToken(newUser._id.toString());

        const userResponse = {
            _id: newUser._id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            adress: newUser.adress,
            ZIP: newUser.ZIP,
            role: newUser.role
        };




        res.status(201).json({
            message: "User created successfully",
            user: userResponse,
            token
        });

    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err })
    }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Debug log
        console.log("Request Params:", req.params);
        

        // Check how to update will be regarding JWT authentication

        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
            return;
        }
        const user = await User.findById({ _id });
        if (!user) {
            res.status(404).json({ message: "No user found with that ID" });
            return;
        }

        const { first_name, last_name, tel, email, password, adress, ZIP, role } = req.body;

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.tel = tel || user.tel;
        user.email = email || user.email;
        user.password = password || user.password;
        user.adress = adress || user.adress;
        user.ZIP = ZIP || user.ZIP;
        user.role = role || user.role;

        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error Updating user", error: err })
    }
}


const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
            return;
        }
        const user = await User.findById({ _id });
        if (!user) {
            res.status(404).json({ message: "No user found with that ID" });
            return;
        }
        await user.deleteOne();
        res.status(200).json({ message: "User has been deleted", user});

    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err });
    }
}


const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        // Generate JWT token
        const token = generateToken(user._id.toString());

        // Return user info and token (excluding password)
        const userResponse = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            adress: user.adress,
            ZIP: user.ZIP,
            role: user.role
        };

        res.status(200).json({
            message: "Login successful",
            user: userResponse,
            token
        });
    } catch (err) {
        res.status(500).json({ message: "Error during login", error: err });
    }
};

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // This will be populated by the auth middleware
        const userId = (req as any).user?.userId;
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user profile", error: err });
    }
};

const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(400).json({ message: "No token provided" });
            return;
        }

        // Add token to blacklist
        addToBlacklist(token);

        res.status(200).json({ 
            message: "Logout successful",
            logoutTime: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ message: "Error during logout", error: err });
    }
};

const getSessionInfo = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ 
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            },
            session: {
                loggedIn: true,
                lastActive: new Date().toISOString()
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching session info", error: err });
    }
};

export default {
    getUsers,
    getUsersByFirstName,
    getUsersByLastName,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    getSessionInfo
};