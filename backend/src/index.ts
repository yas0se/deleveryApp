import express, { Request, Response } from 'express';
import routerAuth from "./routes/AuthRoutes";
import routerUser from "./routes/UserRoutes";


const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

// Register the auth routes
app.use("/", routerAuth);
app.use("/", routerUser);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
