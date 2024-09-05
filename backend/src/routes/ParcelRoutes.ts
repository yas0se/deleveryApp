import express from "express";
import { createParcel, 
    updateParcel, 
    deleteParcel, 
    getParcelById, 
    searchParcels  } from "../controllers/ParcelController";
import verifyToken from "../middlewares/verifyToken";

const routerParcel = express.Router();

routerParcel.post("/parcel/create", verifyToken, createParcel);
routerParcel.put("/parcel/update", verifyToken, updateParcel);
routerParcel.delete("/parcel/delete/:id", verifyToken, deleteParcel);
routerParcel.get("/parcel/:id", getParcelById);
routerParcel.get("/search", searchParcels);

export default routerParcel;
