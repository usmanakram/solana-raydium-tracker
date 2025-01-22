require('dotenv').config();
const { Connection, PublicKey } = require("@solana/web3.js");

// Define Raydium's program ID
// const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"; // Legacy AMM v4
const RAYDIUM_PUBLIC_KEY = "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"; // Standard AMM

// Define Solana mainnet
const HTTPS_URL = process.env.RPC_HTTPS_URL;
const WSS_URL = process.env.RPC_WSS_URL;

const SESSION_HASH = 'DEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);

const connection = new Connection(HTTPS_URL, {
  wsEndpoint: WSS_URL,
  httpHeaders: {"x-session-hash": SESSION_HASH}
});

// Monitor logs
async function main(connection, programAddress) {
  console.log("Monitoring logs for program:", programAddress.toString());
  connection.onLogs(
    programAddress,
    ({ logs, err, signature }) => {
      if (err) return;

      if (logs && logs.some(log => log.includes("initialize2"))) {
        console.log("Signature for 'initialize2':", signature);
        fetchRaydiumAccounts(signature, connection);
      }
    },
    "finalized"
  );
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
  const tx = await connection.getParsedTransaction(
    txId,
    {
      maxSupportedTransactionVersion: 0,
      commitment: 'confirmed'
    });

  credits += 100;

  const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;

  if (!accounts) {
    console.log("No accounts found in the transaction.");
    return;
  }

  const tokenAIndex = 8;
  const tokenBIndex = 9;

  const tokenAAccount = accounts[tokenAIndex];
  const tokenBAccount = accounts[tokenBIndex];

  const displayData = [
    { "Token": "A", "Account Public Key": tokenAAccount.toBase58() },
    { "Token": "B", "Account Public Key": tokenBAccount.toBase58() }
  ];
  console.log("New LP Found");
  console.log(generateExplorerUrl(txId));
  console.table(displayData);
  console.log("Total Credits Used in this session:", credits);
}

function generateExplorerUrl(txId) {
  return `https://solscan.io/tx/${txId}`;
}

main(connection, raydium).catch(console.error);
