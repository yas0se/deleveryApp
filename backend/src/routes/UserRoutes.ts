import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/UserController";
import verifyToken from "../middlewares/verifyToken";
import validateUpdateUser from "../middlewares/validationUser";

const routerUser = express.Router();

// Routes for users
routerUser
  .put("/updateUser", verifyToken, validateUpdateUser, updateUser)
  .get("/userDetails", verifyToken, getUser)
  .delete("/deleteUser", verifyToken, deleteUser);

export default routerUser;
