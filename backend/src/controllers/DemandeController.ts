import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a more specific type based on the user structure
}

// Create a new delivery request (DemandeDeLivraison)
export const createDemande = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id
        const { offer, parcelId } = req.body;

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

        // Récupérer les informations du propriétaire du colis
        const parcel = await prisma.parcel.findUnique({
            where: { id: parcelId },
            select: { userId: true },  // Récupérer uniquement l'ID du propriétaire
        });

        if (!parcel) {
            throw new NotFoundError("Parcel not found");
        }

        // Créer une notification pour le propriétaire du colis
        await prisma.notification.create({
            data: {
                type: 'new_demande',
                content: `You have a new delivery request for your parcel with ID: ${parcelId}`,
                userId: parcel.userId,
                read: false,
            }
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
        const { parcelId } = req.params;

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
export const getDemandesByUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user.id;

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
            // Set the "demanded" field to true for the Parcel
            await prisma.parcel.update({
                where: { id: demande.parcelId },
                data: { demanded: true },
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

        await prisma.notification.create({
            data: {
                type: 'demande_status_update',
                content: `Your delivery request for parcel ID: ${demande.parcelId} has been ${status}`,
                userId: demande.userId,
                read: false,
            }
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
