const { Horizon } = require("@stellar/stellar-sdk");

async function main() {
  const server = new Horizon.Server(
    "https://horizon-testnet.stellar.org"
  );

  const account = await server.loadAccount(
    "GCZPP5ZQUD7HWPLM6BMF4HGETDZIFQNK7I5H3OFBL6GXQ5MQ65E7PGDL"
  );

  console.log("Account ID:");
  console.log(account.accountId());

  console.log("Sequence:");
  console.log(account.sequenceNumber());
}

main().catch(console.error);