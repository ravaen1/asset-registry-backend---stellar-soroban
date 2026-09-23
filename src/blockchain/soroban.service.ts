import dotenv from "dotenv";
import {
  rpc,
  Horizon,
  Contract,
  Keypair,
  Address,
  Account,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative
} from "@stellar/stellar-sdk";

dotenv.config();

export class SorobanService {
  private server: rpc.Server;

  constructor() {
    this.server = new rpc.Server(
      process.env.RPC_URL ||
      "https://soroban-testnet.stellar.org"
    );

    console.log("Soroban Service iniciado");
    console.log("Contrato:", process.env.CONTRACT_ID);
  }

  async healthCheck() {
    try {
      const latestLedger = await this.server.getLatestLedger();

      return {
        contractId: process.env.CONTRACT_ID,
        rpcConnected: true,
        latestLedger: latestLedger.sequence
      };
    } catch {
      return {
        contractId: process.env.CONTRACT_ID,
        rpcConnected: false
      };
    }
  }

  async getAsset(assetId: string) {
    const contract = new Contract(
      process.env.CONTRACT_ID!
    );

    const account = new Account(
      Keypair.random().publicKey(),
      "0"
    );

    const operation = contract.call(
      "get_asset",
      nativeToScVal(assetId)
    );

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const simulation =
      await this.server.simulateTransaction(tx);

    if (!("result" in simulation)) {
      throw new Error(
        `Error en simulación: ${JSON.stringify(simulation)}`
      );
    }

    if (!simulation.result) {
      throw new Error(
        "La simulación no devolvió resultado."
      );
    }

    const nativeResult = scValToNative(
      simulation.result.retval
    );

    const [owner, description] =
      nativeResult as [string, string];

    return {
      assetId,
      owner,
      description
    };
  }

//creaando por aca 

async createAsset(
    assetId: string,
    owner: string,
    description: string
  ) {
    const horizon = new Horizon.Server(
      "https://horizon-testnet.stellar.org"
    );

    const sourceKeypair = Keypair.fromSecret(
      process.env.SECRET_KEY!
    );

    const account = await horizon.loadAccount(
      sourceKeypair.publicKey()
    );

    const contract = new Contract(
      process.env.CONTRACT_ID!
    );

    const operation = contract.call(
      "register_asset",
      nativeToScVal(assetId),
      new Address(owner).toScVal(),
      nativeToScVal(description)
    );

    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase: Networks.TESTNET
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    const prepared =
      await this.server.prepareTransaction(tx);

    prepared.sign(sourceKeypair);

    const result =
      await this.server.sendTransaction(prepared);

    if(!("hash" in result)) {
      return result;
    }  

    const confirmation =
      await this.server.pollTransaction(
        result.hash
      );

     return confirmation; 
  }

  async transferAsset(
  assetId: string,
  newOwner: string
) {
  const horizon = new Horizon.Server(
    "https://horizon-testnet.stellar.org"
  );

  const sourceKeypair = Keypair.fromSecret(
    process.env.SECRET_KEY!
  );

  const account = await horizon.loadAccount(
    sourceKeypair.publicKey()
  );

  const contract = new Contract(
    process.env.CONTRACT_ID!
  );

  const operation = contract.call(
    "transfer_asset",
    nativeToScVal(assetId),
    new Address(newOwner).toScVal()
  );

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const prepared =
    await this.server.prepareTransaction(tx);

  prepared.sign(sourceKeypair);

  const result =
    await this.server.sendTransaction(prepared);

    if(!("hash" in result)) {
      return result;
    }  

    const confirmation =
      await this.server.pollTransaction(
        result.hash
      );

  return confirmation;
}


} 