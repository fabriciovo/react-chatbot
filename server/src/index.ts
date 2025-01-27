import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import botRoutes from "@routes/botRoutes";
import syncDataRoutes from "@routes/syncDataRoutes";

import { connectToDatabase } from "@config/database";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

connectToDatabase();

app.use("/api", botRoutes);

app.use("/api", syncDataRoutes);

app.get("/", (req: Request, res: Response) => {
  res.json({
    answer:
      "Funcionando :)",
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "404 - Not Found", status: 404 });
});

app.use((error: any, req: Request, res: Response) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message, status: 500 });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
