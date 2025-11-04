"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controller/UserController"));
const auth_1 = require("../middleware/auth");
const { getUsers, createUser, getUsersByFirstName, getUsersByLastName, getUserById, updateUser, deleteUser, loginUser, getCurrentUser, getSessionInfo, logoutUser } = UserController_1.default;
const UserRouter = express_1.default.Router();
// Public Routes
UserRouter.post("/register", createUser);
UserRouter.post("/login", loginUser);
// Protected Routes
UserRouter.get("/", getUsers);
UserRouter.get("/first/:first_name", getUsersByFirstName);
UserRouter.get("/last/:last_name", getUsersByLastName);
UserRouter.get("/id/:_id", getUserById);
UserRouter.get("/current", getCurrentUser);
UserRouter.put("/:_id", auth_1.authenticateToken, updateUser);
UserRouter.delete("/:_id", auth_1.authenticateToken, deleteUser);
UserRouter.get("/session", auth_1.authenticateToken, getSessionInfo);
UserRouter.post("/logout", auth_1.authenticateToken, logoutUser);
exports.default = UserRouter;
