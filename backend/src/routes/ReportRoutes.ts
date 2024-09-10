import express from "express";
import { createReport, 
    getReportsByParcel, 
    getReportsByUser, 
     } from "../controllers/ReportController";
import verifyToken from "../middlewares/verifyToken";
import verifyAdmine from "../middlewares/verifyAdmine";

const routerReport = express.Router();

routerReport.post("/report/create", verifyToken, createReport);
routerReport.get("/report/user", verifyToken, getReportsByUser);
routerReport.get("/report/parcel/:parcelId", verifyAdmine, getReportsByParcel);

export default routerReport;