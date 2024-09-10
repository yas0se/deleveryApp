import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a more specific type based on the user structure
}

const prisma = new PrismaClient();

export const getConversation = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId1 = req.user.id;
    const { userId2 } = req.body;
    if (!userId1 || !userId2) {
        throw new BadRequestError("User IDs are required");
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: Number(userId1), receiverId: Number(userId2) },
                    { senderId: Number(userId2), receiverId: Number(userId1) },
                ],
            },
            orderBy: {
                id: 'asc',
            },
        });

        if (!messages.length) {
            throw new NotFoundError("No conversation found");
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve conversation' });
    }
};

export const getMessagesByUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    if (!userId) {
        throw new BadRequestError("User ID is required");
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: Number(userId) },
                    { receiverId: Number(userId) },
                ],
            },
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

export const sendMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const senderId= req.user.id;
    const { receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
        throw new BadRequestError("Sender ID, receiver ID, and content are required");
    }

    if (senderId == receiverId ) {
        throw new BadRequestError("Cannot send a message to yourself");
    }

    try {
        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                receiverId,
            },
        });

        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};