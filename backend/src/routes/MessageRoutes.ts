import express from "express";
import { getConversation, 
    getMessagesByUser, 
    sendMessage } from "../controllers/MessageController";
import verifyToken from "../middlewares/verifyToken";

const routerMessage = express.Router();

routerMessage.post("/message/create", verifyToken, sendMessage);
routerMessage.get("/message/user", verifyToken, getMessagesByUser);
routerMessage.get("/message/", verifyToken, getConversation);
export default routerMessage;
