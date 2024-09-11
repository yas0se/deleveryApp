import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a more specific type based on the user structure
}
const prisma = new PrismaClient();

export const createReport = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { parcelId, reason } = req.body;

        // Check if all the data are filled
        if (!userId || !parcelId || !reason ) {
            throw new BadRequestError("Please fill all the data");
        }

        // Save the report in the database
        const newReport = await prisma.report.create({
            data: {
                userId,
                parcelId,
                reason
            },
        });

        // Récupérer tous les utilisateurs administrateurs
        const admins = await prisma.user.findMany({
            where: {
                isAdmine: true, 
            }
        });

        // Créer une notification pour chaque administrateur
        const notifications = admins.map((admin) => ({
            type: 'new_report',
            content: `A new report has been submitted for parcel ID: ${parcelId}`,
            userId: admin.id,
            read: false,
        }));

        // Enregistrer toutes les notifications dans la base de données
        await prisma.notification.createMany({
            data: notifications,
        });


        return res.status(StatusCodes.OK).json(newReport);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const getReportsByParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parcelId } = req.params;

        // Vérifiez si l'ID est fourni
        if (!parcelId) {
            throw new BadRequestError("Parcel ID is required");
        }

        const Reports = await prisma.report.findMany({
            where: {
                parcelId: parseInt(parcelId),
            },
        });

        if (!Reports) {
            throw new NotFoundError("Parcel not found");
        }

        return res.status(StatusCodes.OK).json(Reports);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const getReportsByUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;

        // Vérifiez si l'ID est fourni
        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        const Reports = await prisma.report.findMany({
            where: {
                userId: parseInt(userId),
            },
        });

        if (!Reports) {
            throw new NotFoundError("Reports not found");
        }

        return res.status(StatusCodes.OK).json(Reports);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};