import { Request, Response } from "express";
import { SorobanService } from "../blockchain/soroban.service";
import { error } from "node:console";
import { StrKey } from "@stellar/stellar-sdk";

const soroban = new SorobanService();

export class AssetController {
  static async health(
    req: Request,
    res: Response
  ) {
    const result =
      await soroban.healthCheck();

    res.json(result);
  }

  static async getAsset(
    req: Request,
    res: Response
  ) {
    const id = req.params.id as string;

    const asset =
      await soroban.getAsset(id);

    res.json(asset);
  }

  static async createAsset(
    req: Request,
    res: Response
  ) {
    try {
      const {
        assetId,
        owner,
        description
      } = req.body;

      if (!assetId || !owner || !description){
        return res.status(400).json({
          error:
          "ID del activo, propietario y descripción son obligatorios"
        });
      }

      if (!StrKey.isValidEd25519PublicKey(owner)){
        return res.status(400).json({
          error:
          "Direccion stellar invalida"
        })
      }

      const result =
        await soroban.createAsset(
          assetId,
          owner,
          description
        );

      if (
        "status" in result &&
        result.status ==="SUCCESS"
      ){
        return res.json({
    success: true,
    message:
      "Activo registrado correctamente.",
    txHash:
      "txHash" in result
        ? result.txHash
        : null
  });
      }

      return res.status(400).json({
  success: false,
  message:
    "No fue posible registrar el activo.",
  result
});



    } catch (error) {
      res.status(500).json({
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido"
      });
    }
  }

  static async transferAsset(
  req: Request,
  res: Response
) {
  try {
    const {
      assetId,
      newOwner
    } = req.body;

    if (!assetId || !newOwner) {
      return res.status(400).json({
        error:
        "assetId y newOwner son obligatorios"
        
      })
    }

    if (
      !StrKey.isValidEd25519PublicKey(newOwner)
    )
    {
      return res.status(400).json({
        error:
        "Direccion Stellar invalida"
      });
    }

    const result =
      await soroban.transferAsset(
        assetId,
        newOwner
      );

    if (
  "status" in result &&
  result.status === "SUCCESS"
) {
  return res.json({
    success: true,
    message:
      "Activo transferido correctamente.",
    txHash:
      "txHash" in result
        ? result.txHash
        : null
  });
}

return res.status(400).json({
  success: false,
  message:
    "La transferencia no pudo completarse.",
  result
});


  } catch (error) {
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido"
    });
  }
}

}


