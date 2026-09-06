import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";

const router = Router();

router.get("/health", AssetController.health);

router.get("/assets/:id", AssetController.getAsset);

router.post("/assets", AssetController.createAsset);

router.post("/assets/transfer", AssetController.transferAsset);

export default router;