"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = require("../model/UserModel");
const auth_1 = require("../utils/auth");
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const getUsers = async (req, res) => {
    try {
        const users = await UserModel_1.User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching users ", error: err });
    }
};
const getUsersByFirstName = async (req, res) => {
    try {
        const { first_name } = req.params;
        if (!first_name) {
            res.status(400).json({ first_name: "First_name params is required " });
        }
        const user = await UserModel_1.User.find({ first_name });
        if (!user) {
            res.status(404).json({ message: "No users found with that name! " });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error Fetching user " });
    }
};
const getUsersByLastName = async (req, res) => {
    try {
        const { last_name } = req.params;
        if (!last_name) {
            res.status(400).json({ first_name: "First_name params is required " });
        }
        const user = await UserModel_1.User.find({ last_name });
        if (!user) {
            res.status(404).json({ message: "No users found with that name! " });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error Fetching user ", error: err });
    }
};
const getUserById = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
        }
        const user = await UserModel_1.User.findOne({ _id });
        if (!user) {
            res.status(404).json({ message: "No user found with that ID" });
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: "Error Fetching User", error: err });
    }
};
// Add JWT Authentication when it comes to creating a password
const createUser = async (req, res) => {
    try {
        const { first_name, last_name, tel, email, password, adress, ZIP } = req.body;
        const existingUser = await UserModel_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with this email " });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const newUser = new UserModel_1.User({
            first_name,
            last_name,
            tel,
            email,
            password,
            adress,
            ZIP,
        });
        await newUser.save();
        const token = (0, auth_1.generateToken)(newUser._id.toString());
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
    }
    catch (err) {
        res.status(500).json({ message: "Error creating user", error: err });
    }
};
const updateUser = async (req, res) => {
    try {
        // Debug log
        console.log("Request Params:", req.params);
        // Check how to update will be regarding JWT authentication
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
            return;
        }
        const user = await UserModel_1.User.findById({ _id });
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
    }
    catch (err) {
        res.status(500).json({ message: "Error Updating user", error: err });
    }
};
const deleteUser = async (req, res) => {
    try {
        const { _id } = req.params;
        if (!_id) {
            res.status(400).json({ _id: "_id params is required" });
            return;
        }
        const user = await UserModel_1.User.findById({ _id });
        if (!user) {
            res.status(404).json({ message: "No user found with that ID" });
            return;
        }
        await user.deleteOne();
        res.status(200).json({ message: "User has been deleted", user });
    }
    catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await UserModel_1.User.findOne({ email });
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
        const token = (0, auth_1.generateToken)(user._id.toString());
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
    }
    catch (err) {
        res.status(500).json({ message: "Error during login", error: err });
    }
};
const getCurrentUser = async (req, res) => {
    try {
        // This will be populated by the auth middleware
        const userId = req.user?.userId;
        const user = await UserModel_1.User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching user profile", error: err });
    }
};
const logoutUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(400).json({ message: "No token provided" });
            return;
        }
        // Add token to blacklist
        (0, tokenBlacklist_1.addToBlacklist)(token);
        res.status(200).json({
            message: "Logout successful",
            logoutTime: new Date().toISOString()
        });
    }
    catch (err) {
        res.status(500).json({ message: "Error during logout", error: err });
    }
};
const getSessionInfo = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const user = await UserModel_1.User.findById(userId).select('-password');
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
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching session info", error: err });
    }
};
exports.default = {
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
