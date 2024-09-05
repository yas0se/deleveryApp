import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";


const prisma = new PrismaClient();

export const createParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { description, weight, price, origin, destination, userId } = req.body;

        // Check if all the data are filled
        if (!description || !weight || !price || !origin || !destination || !userId) {
            throw new BadRequestError("Please fill all the data");
        }

        // Save the Parcel in the database
        const newParcel = await prisma.parcel.create({
            data: {
                description,
                weight,
                price,
                origin,
                destination,
                userId
            },
        });

        return res.status(StatusCodes.OK).json(newParcel);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const updateParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, description, weight, price, origin, destination } = req.body;

        // Check if all the data are filled
        if (!id || !description || !weight || !price || !origin || !destination ) {
            throw new BadRequestError("Please fill all the data");
        }

        const parcel = await prisma.parcel.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!parcel) {
            return res.status(StatusCodes.NOT_FOUND).json({
                error: new NotFoundError("User not found!").message,
            });
        }

        // Save the Parcel in the database
        const parcelUpdated = await prisma.parcel.update({
            where: {
                id: parseInt(id),
            },
            data: {
                description,
                weight,
                price,
                origin,
                destination
            },
        });

        return res.status(StatusCodes.OK).json(parcelUpdated);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const deleteParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            throw new BadRequestError("Parcel ID is required");
        }

        const parcel = await prisma.parcel.findUnique({
            where: {
                id: parseInt(id), // S'assurer que l'ID est un entier
            },
        });

        if (!parcel) {
            throw new NotFoundError("Parcel not found");
        }

        await prisma.parcel.delete({
            where: {
                id: parseInt(id),
            },
        });

        return res.status(StatusCodes.OK).json({ message: "Parcel deleted successfully" });
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const getParcelById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        // Vérifiez si l'ID est fourni
        if (!id) {
            throw new BadRequestError("Parcel ID is required");
        }

        const parcel = await prisma.parcel.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!parcel) {
            throw new NotFoundError("Parcel not found");
        }

        return res.status(StatusCodes.OK).json(parcel);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};


export const searchParcels = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { origin, destination, minWeight, maxWeight, minPrice, maxPrice } = req.query;

        // Initialiser l'objet de filtre
        const whereClause: any = {};

        // Ajouter des filtres pour l'origine et la destination
        if (origin && typeof origin === 'string') {
            whereClause.origin = origin;
        }

        if (destination && typeof destination === 'string') {
            whereClause.destination = destination;
        }

        // Ajouter des filtres pour le poids
        if (minWeight || maxWeight) {
            whereClause.weight = {};

            if (minWeight) {
                const minWeightValue = parseFloat(minWeight as string);
                if (!isNaN(minWeightValue)) {
                    whereClause.weight.gte = minWeightValue;
                }
            }

            if (maxWeight) {
                const maxWeightValue = parseFloat(maxWeight as string);
                if (!isNaN(maxWeightValue)) {
                    whereClause.weight.lte = maxWeightValue;
                }
            }
        }

        // Ajouter des filtres pour le prix
        if (minPrice || maxPrice) {
            whereClause.price = {};

            if (minPrice) {
                const minPriceValue = parseFloat(minPrice as string);
                if (!isNaN(minPriceValue)) {
                    whereClause.price.gte = minPriceValue;
                }
            }

            if (maxPrice) {
                const maxPriceValue = parseFloat(maxPrice as string);
                if (!isNaN(maxPriceValue)) {
                    whereClause.price.lte = maxPriceValue;
                }
            }
        }

        // Debug: Afficher la requête de filtre
        console.log('Where Clause:', whereClause);

        // Effectuer la recherche dans la base de données
        const parcels = await prisma.parcel.findMany({
            where: whereClause,
        });

        // Debug: Afficher les résultats obtenus
        console.log('Parcels Found:', parcels);

        return res.status(StatusCodes.OK).json(parcels);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};