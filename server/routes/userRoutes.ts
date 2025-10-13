import express from "express";
import UserController from "../controller/UserController";

const { getUsers, createUser, getUsersByFirstName, getUsersByLastName, getUserById, updateUser, deleteUser } = UserController;

const UserRouter = express.Router();

UserRouter.get("/", getUsers);
UserRouter.get("/first/:first_name", getUsersByFirstName);
UserRouter.get("/last/:last_name", getUsersByLastName);
UserRouter.get("/id/:_id", getUserById);
UserRouter.post("/", createUser);
UserRouter.put("/:_id", updateUser);
UserRouter.delete("/:_id", deleteUser);


export default UserRouter;