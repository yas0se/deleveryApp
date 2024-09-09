import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
    const { userId1, userId2 } = req.body;
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

export const getMessagesByUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body;

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

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
        throw new BadRequestError("Sender ID, receiver ID, and content are required");
    }

    try {
        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
            },
        });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};