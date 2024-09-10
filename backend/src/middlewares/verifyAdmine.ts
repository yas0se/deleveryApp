import { UnauthorizedError } from "../errors/index";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// Extend the Request interface to include the 'user' property
interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a more specific type based on the user structure
}

const prisma = new PrismaClient();

function verifyAdmin(req: CustomRequest, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new UnauthorizedError("No token provided");
        }

        const token = authorization.split(" ")[1];
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        // Verify the token
        const payload = jwt.verify(token, "user_key") as { user: any };
        req.user = payload.user;
        if (!req.user.isAdmine) {
            throw new UnauthorizedError("Access denied. Admin privileges required");
        }

        next(); // Proceed if the user is an admin

    } catch (error: any) {
        console.log(error);
        return res.status(error.statusCode || 500).json({ error: error.message });
    }
}

export default verifyAdmin;
