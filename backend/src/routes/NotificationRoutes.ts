import express from 'express';
import {
  getNotificationsByUser,
  createNotification,
  markAsRead,
  deleteNotification,
} from '../controllers/NotificationController';
import verifyToken from '../middlewares/verifyToken';

const routerNotification = express.Router();
routerNotification.get('/notifications/:userId', verifyToken, getNotificationsByUser);
routerNotification.post('/notifications', verifyToken, createNotification);
routerNotification.patch('/notifications/:notificationId/read', verifyToken, markAsRead);
routerNotification.delete('/notifications/:notificationId', verifyToken, deleteNotification);

export default routerNotification;
