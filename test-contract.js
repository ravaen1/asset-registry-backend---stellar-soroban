/*const {
  rpc,
  Contract,
  Keypair,
  Account,
  TransactionBuilder,
  Networks,
  nativeToScVal,
  scValToNative
} = require("@stellar/stellar-sdk");

async function main() {
  const server = new rpc.Server(
    "https://soroban-testnet.stellar.org"
  );

  const contract = new Contract(
    "CC6F3LXHRTRIUAVRTKLYNPQF2AEZO2HX7MFDUHZ5UHVFULSPAXJSAHUU"
  );

  const account = new Account(
    Keypair.random().publicKey(),
    "0"
  );

  const operation = contract.call(
    "get_asset",
    nativeToScVal("asset-001")
  );

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(operation)
    .setTimeout(30)
    .build();

  const simulation = await server.simulateTransaction(tx);

  const nativeResult = scValToNative(
  simulation.result.retval
);

console.log("Resultado nativo:");
console.log(nativeResult);
}

main().catch(console.error);*/

const sdk = require("@stellar/stellar-sdk");

console.log(
  Object.keys(sdk).filter(
    key =>
      key.toLowerCase().includes("transaction") ||
      key.toLowerCase().includes("sign")
  )
);