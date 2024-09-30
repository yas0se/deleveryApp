import express from "express";
import { createDemande, 
    getDemandesByParcel, 
    getDemandesByUser, 
    updateDemandeStatus, 
    deleteDemande } from "../controllers/DemandeController";
import verifyToken from "../middlewares/verifyToken";

const routerDemande = express.Router();

routerDemande.post("/demande/create", verifyToken, createDemande);
routerDemande.get("/demande/parcel/:parcelId", getDemandesByParcel);
routerDemande.get("/demande/user/:userId", verifyToken, getDemandesByUser);
routerDemande.put("/demande/update-status", verifyToken, updateDemandeStatus);
routerDemande.delete("/demande/delete", verifyToken, deleteDemande);

export default routerDemande;
