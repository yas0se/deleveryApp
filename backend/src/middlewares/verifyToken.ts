import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the 'user' property
interface CustomRequest extends Request {
  user?: any; // You can replace 'any' with a more specific type if you know the structure of the user object
}

function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedError("No token provided");
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = jwt.verify(token, "user_key") as { user: any };
    req.user = payload.user;
    console.log("token userid: ", req.user.id)

    next();
  } catch (error: any) {
    console.log(error);
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

export default verifyToken;
