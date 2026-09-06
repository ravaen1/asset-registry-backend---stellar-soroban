require("dotenv").config();

const {
  rpc,
  Horizon,
  Contract,
  Keypair,
  Address, 
  Account,
  TransactionBuilder,
  Networks,
  nativeToScVal
} = require("@stellar/stellar-sdk");

async function main() {
  console.log("Contract:", process.env.CONTRACT_ID);

  const server = new rpc.Server(
    process.env.RPC_URL
  );

  const sourceKeypair = Keypair.fromSecret(
    process.env.SECRET_KEY
  );

  console.log(
    "Public Key:",
    sourceKeypair.publicKey()
  );

  const { Horizon } = require("@stellar/stellar-sdk");

const horizon = new Horizon.Server(
  "https://horizon-testnet.stellar.org"
);

const account = await horizon.loadAccount(
  sourceKeypair.publicKey()
);



  console.log(
    "Account sequence:",
    account.sequenceNumber()
  );

  const contract = new Contract(
    process.env.CONTRACT_ID
  );

  const operation = contract.call(
    "register_asset",
    nativeToScVal("asset-002"),
    new Address(
        process.env.OWNER_ADDRESS
    ).toScVal(),
    nativeToScVal("ipfs://nuevo-activo")
  );

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  console.log("Transacción construida");

  const prepared =
    await server.prepareTransaction(tx);

  console.log("Transacción preparada");

  prepared.sign(sourceKeypair);

  console.log("Transacción firmada");

  const result =
    await server.sendTransaction(prepared);

  console.log("Resultado:");

  console.dir(result, {
    depth: null
  });
}

main().catch(console.error);