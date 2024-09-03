import express from "express";
import { register, loginUser } from "../controllers/AuthController";
import { validateLogin, validateRegister } from "../middlewares/validationAuth";

const routerAuth = express.Router();

routerAuth.post("/register", validateRegister, register);
routerAuth.post("/login", validateLogin, loginUser);

export default routerAuth;
