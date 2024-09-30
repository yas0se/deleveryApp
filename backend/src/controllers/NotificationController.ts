import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface for notification creation request body
interface CreateNotificationBody {
  type: string;
  content: string;
  userId: number;
}

// Get all notifications for a user
export const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notification.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving notifications' });
  }
};

// Create a new notification
export const createNotification = async (req: Request<{}, {}, CreateNotificationBody>, res: Response): Promise<void> => {
  try {
    const { type, content, userId } = req.body;

    const newNotification = await prisma.notification.create({
      data: {
        type,
        content,
        userId: parseInt(userId.toString()),
      },
    });

    res.status(201).json(newNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating notification' });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    console.log("markAsRead start")

    const updatedNotification = await prisma.notification.update({
      where: { id: parseInt(notificationId) },
      data: { read: true },
    });
    console.log("updatedNotification: ", updatedNotification)

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};

// Delete a notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;

    await prisma.notification.delete({
      where: { id: parseInt(notificationId) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};
