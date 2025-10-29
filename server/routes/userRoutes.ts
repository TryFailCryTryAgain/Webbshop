import express from "express";
import UserController from "../controller/UserController";
import { authenticateToken } from '../middleware/auth';

const { getUsers, createUser, getUsersByFirstName, getUsersByLastName, getUserById, updateUser, deleteUser, loginUser, getCurrentUser, getSessionInfo, logoutUser } = UserController;

const UserRouter = express.Router();

// Public Routes

UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);

// Protected Routes

UserRouter.get("/", getUsers);
UserRouter.get("/first/:first_name", getUsersByFirstName);
UserRouter.get("/last/:last_name", getUsersByLastName);
UserRouter.get("/id/:_id", getUserById);
UserRouter.get("/current", getCurrentUser);
UserRouter.put("/:_id", authenticateToken, updateUser);
UserRouter.delete("/:_id", authenticateToken, deleteUser);
UserRouter.get("/session", authenticateToken, getSessionInfo);
UserRouter.post("/logout", authenticateToken, logoutUser);


export default UserRouter;