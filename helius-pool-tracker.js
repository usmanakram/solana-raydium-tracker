/**
 * Signup at Helius, select free plan.
 * Create a webhook with
 *  "Transaction Type" => "CREATE_POOL",
 *  "Account Addresses" => your desired Raydium Programs (https://docs.raydium.io/raydium/protocol/developers/addresses)
 *
 * https://www.helius.dev/
 */

const express = require('express');

const app = express();
const port = 4000;
const tokenLogs = [];

app.use(express.json());

app.post('/webhook', (req, res) => {
  try {

    const requestBody = req.body;
    console.log('response', requestBody);

    const signature = requestBody[0].signature;
    let tokenData1 = requestBody[0].tokenTransfers[0];
    let tokenData2 = requestBody[0].tokenTransfers[1];

    if(requestBody[0].tokenTransfers[0].mint === 'So11111111111111111111111111111111111111112') {
      tokenData1 = requestBody[0].tokenTransfers[1];
      tokenData2 = requestBody[0].tokenTransfers[0];
    }

    // Skip duplicate signature
    if ( tokenLogs.includes(signature) ) return;

    tokenLogs.push(signature);

    console.log('/****************************************************************************************************/');
    console.log('Signature: ', `https://solscan.io/tx/${signature}`);
    console.log('Mint: ', tokenData1.mint);
    console.log('SOL Invested: ', tokenData2.tokenAmount); // The amount of Solana invested by the developer
    console.log('Dexscreener: ', `https://dexscreener.com/solana/${tokenData1.mint}`);
    console.log('/****************************************************************************************************/', "\n");

  } catch (ex) {
    console.log('Exception occurred!');
    console.log(ex);
  }

  res.send('OK');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));