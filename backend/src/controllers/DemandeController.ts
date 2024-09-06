import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Create a new delivery request (DemandeDeLivraison)
export const createDemande = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { offer, userId, parcelId } = req.body;

        // Check if all the data are filled
        if (!offer || !userId || !parcelId) {
            throw new BadRequestError("Please fill all the data");
        }

        // Save the DemandeDeLivraison in the database
        const newDemande = await prisma.demande.create({
            data: {
                offer,
                userId,
                parcelId
            },
        });

        return res.status(StatusCodes.OK).json(newDemande);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

// Get all demandes by parcelId
export const getDemandesByParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { parcelId } = req.body;

        if (!parcelId) {
            throw new BadRequestError("Parcel ID is required");
        }

        const demandes = await prisma.demande.findMany({
            where: {
                parcelId: parseInt(parcelId), // Ensure parcelId is an integer
            },
        });

        if (!demandes.length) {
            throw new NotFoundError("No demandes found for this parcel");
        }

        return res.status(StatusCodes.OK).json(demandes);
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


// Get all demandes by userId
export const getDemandesByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            throw new BadRequestError("User ID is required");
        }

        const demandes = await prisma.demande.findMany({
            where: {
                userId: parseInt(userId),
            },
        });

        if (!demandes.length) {
            throw new NotFoundError("No demandes found for this user");
        }

        return res.status(StatusCodes.OK).json(demandes);
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

// Update the status of a delivery request (DemandeDeLivraison)
export const updateDemandeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, status } = req.body;

        if (!id || !status) {
            throw new BadRequestError("Demande ID and status are required");
        }

        const demande = await prisma.demande.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!demande) {
            throw new NotFoundError("Demande not found");
        }

        // If the status is being updated to "accepted"
        if (status === "accepted") {
            // Update all other demandes for the same parcel to "rejected"
            await prisma.demande.updateMany({
                where: {
                    parcelId: demande.parcelId,
                    id: { not: parseInt(id) }, // Exclude the current demande
                    status: { not: "rejected" } // Avoid re-updating already rejected ones
                },
                data: {
                    status: "rejected",
                },
            });
        }

        // Update the current demande status
        const updatedDemande = await prisma.demande.update({
            where: {
                id: parseInt(id),
            },
            data: {
                status,
            },
        });

        return res.status(StatusCodes.OK).json(updatedDemande);
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


// Delete a delivery request (DemandeDeLivraison)
export const deleteDemande = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;

        if (!id) {
            throw new BadRequestError("Demande ID is required");
        }

        const demande = await prisma.demande.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!demande) {
            throw new NotFoundError("Demande not found");
        }

        await prisma.demande.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(StatusCodes.OK).json({ message: "Demande deleted successfully" });
    } catch (error: any) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};
