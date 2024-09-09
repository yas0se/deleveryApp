import express, { Request, Response } from 'express';
import routerAuth from "./routes/AuthRoutes";
import routerUser from "./routes/UserRoutes";
import routerParcel from './routes/ParcelRoutes';
import routerDemande from './routes/DemandeRoutes';
import routerReport from './routes/ReportRoutes';
import routerMessage from './routes/MessageRoutes';


const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

// Register the routes
app.use("/", routerAuth);
app.use("/", routerUser);
app.use("/", routerParcel);
app.use("/", routerDemande);
app.use("/", routerReport);
app.use("/", routerMessage);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
