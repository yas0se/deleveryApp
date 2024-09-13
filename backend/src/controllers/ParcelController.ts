import { StatusCodes } from "http-status-codes";
import { PrismaClient } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../errors/index";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
    user?: any; // Replace 'any' with a more specific type based on the user structure
}

const prisma = new PrismaClient();

export const createParcel = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { description, weight, price, origin, destination, imageUrl } = req.body;
        console.log("Parcel data:", { description, weight, price, origin, destination, imageUrl, userId });


        // Check if all the data are filled
        if (!description || !weight || !price || !origin || !destination || !userId || !imageUrl) {
            throw new BadRequestError("Please fill all the data");
        }

        // Save the Parcel in the database
        const newParcel = await prisma.parcel.create({
            data: {
                description,
                weight: parseFloat(weight),
                imageUrl,
                price: parseFloat(price),
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

export const updateParcel = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { id, description, weight, price, origin, destination, imageUrl } = req.body;

        // Check if all the data are filled
        if (!id || !description || !weight || !price || !origin || !destination || !imageUrl ) {
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

        if (parcel.userId != userId){
            throw new BadRequestError("You can only update your own parcels");
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
                destination,
                imageUrl
            },
        });

        return res.status(StatusCodes.OK).json(parcelUpdated);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const deleteParcel = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
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

        if (parcel.userId != userId && !req.user.isAdmine){
            throw new BadRequestError("You can only delete your own parcels");
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
        const { origin, destination, minWeight, maxWeight, minPrice, maxPrice } = req.body;
        if(!origin){
            throw new BadRequestError("Origin is required");
        }

        // Étape 1 : Trouver tous les colis avec un point de départ spécifique
        const parcels = await prisma.parcel.findMany({
            where: { origin: origin as string },
        });

        // Étape 2 : Filtrer les résultats trouvés en fonction des autres critères
        let filteredParcels = parcels;

        // Filtrer par destination
        if (destination) {
            filteredParcels = filteredParcels.filter(parcel => parcel.destination === destination);
        }

        // Filtrer par poids minimum
        if (minWeight) {
            const minWeightValue = parseFloat(minWeight as string);
            if (!isNaN(minWeightValue)) {
                filteredParcels = filteredParcels.filter(parcel => parcel.weight >= minWeightValue);
            }
        }

        // Filtrer par poids maximum
        if (maxWeight) {
            const maxWeightValue = parseFloat(maxWeight as string);
            if (!isNaN(maxWeightValue)) {
                filteredParcels = filteredParcels.filter(parcel => parcel.weight <= maxWeightValue);
            }
        }

        // Filtrer par prix minimum
        if (minPrice) {
            const minPriceValue = parseFloat(minPrice as string);
            if (!isNaN(minPriceValue)) {
                filteredParcels = filteredParcels.filter(parcel => parcel.price >= minPriceValue);
            }
        }

        // Filtrer par prix maximum
        if (maxPrice) {
            const maxPriceValue = parseFloat(maxPrice as string);
            if (!isNaN(maxPriceValue)) {
                filteredParcels = filteredParcels.filter(parcel => parcel.price <= maxPriceValue);
            }
        }

        // Retourner les résultats filtrés
        return res.status(StatusCodes.OK).json(filteredParcels);
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};

export const getAllParcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parcels = await prisma.parcel.findMany();

        if (!parcels.length) { // Check for an empty array
            throw new NotFoundError("Parcels not found");
        }

        // Wrap the parcels array in an object
        return res.status(StatusCodes.OK).json({ parcels });
    } catch (error: any) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
    }
};
