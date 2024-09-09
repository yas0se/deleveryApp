import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";


const prisma = new PrismaClient();

export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, parcelId, reason } = req.body;

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

export const getReportsByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

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