import express from 'express';
import {JsonRpcProvider} from '@ethersproject/providers';
import {AlphaRouter, CurrencyAmount} from '@uniswap/smart-order-router'
import {TradeType} from "@uniswap/sdk-core";
import dotenv from 'dotenv';
import {parseToken} from "./utils";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const chainId = Number(process.env.CHAIN_ID) || 1;
const jsonRpcURL = process.env.JSON_RPC_URL;

const app = express();
app.use(express.json());

const jsonRpcClient = new JsonRpcProvider(jsonRpcURL, chainId);
const router = new AlphaRouter({chainId, provider: jsonRpcClient});

app.get('/', (req, res) => {
    const reqBody = req.body;

    const tokenIn = parseToken(reqBody.tokenIn, chainId);
    const tokenOut = parseToken(reqBody.tokenOut, chainId);
    const tradeType = reqBody.tradeType as TradeType || TradeType.EXACT_INPUT;

    router.route(CurrencyAmount.fromRawAmount(tokenIn, reqBody.amountIn), tokenOut, tradeType)
        .then(route => {
            if (!route) {
                res.status(404);
                res.send("No route found");
                return;
            }
            res.json(route);
        }).catch(err => {
        res.status(500);
        res.send("Internal server error");
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
