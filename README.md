# Uniswap smart router as a service
This is a simple service that allows you to get the 
best price for a swap between two tokens on the Uniswap exchange. 
It is based on the [Uniswap Smart Order Router](https://github.com/Uniswap/smart-order-router).

## How to install
1. Clone the repository
2. Install dependencies with `yarn install`
3. Create a `.env` file with the following variables:
```
PORT=3000 # Port to run the server on
CHAIN_ID=1 # Chain ID of the network to connect to
JSON_RPC_URL="https://mainnet.infura.io/v3/<api_key>" # JSON RPC URL of the network to connect to (Infura for example)
```
4. Run the server with `yarn dev` or build it with `yarn build` and run it with `yarn start`

## How to use
Send a `GET` request to `/route` with the following JSON body:
```json5
{
  "amount": 200, // Amount of currency to swap
  "tradeType": 0, // 0 for exact input, 1 for exact output (default: 0)
  "currencyAmount": { // The amount specified by the user. For EXACT_IN swaps, this is the input token amount. For EXACT_OUT swaps, this is the output token
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Address of the currency to swap
    "decimals": 18, // Decimals of the currency to swap
    "symbol": "USDT", // Symbol of the currency to swap (optional)
    "name": "Tether USD" // Name of the currency to swap (optional)
  },
  "currency": { // This is the output token. For EXACT_OUT, this is the input token
    "address": "0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b", // Address of the currency to receive
    "decimals": 18, // Decimals of the currency to receive
    "symbol": "AXS", // Symbol of the currency to receive (optional)
    "name": "Axie Infinity Shard" // Name of the currency to receive (optional)
  }
}
```
## Other
### Authorization
If you want to restrict access to the service,
I recommend to use a reverse proxy like nginx.
You can also implement your own Authorization middleware.