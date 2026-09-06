import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import assetRoutes from "./routes/asset.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "Asset Registry Backend",
    status: "running"
  });
});

app.use("/api", assetRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});