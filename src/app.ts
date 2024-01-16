import express from 'express';
import {JsonRpcProvider} from '@ethersproject/providers';
import {AlphaRouter, CurrencyAmount} from '@uniswap/smart-order-router'
import {TradeType} from "@uniswap/sdk-core";
import dotenv from 'dotenv';
import cors from 'cors';
import {parseToken} from "./utils";

dotenv.config();

const port = Number(process.env.PORT) || 3000;
const chainId = Number(process.env.CHAIN_ID) || 1;
const jsonRpcURL = process.env.JSON_RPC_URL;

console.log(`Using chainId ${chainId} and JSON RPC URL ${jsonRpcURL}`);

const app = express();
app.use(express.json());
app.use(cors());

const jsonRpcClient = new JsonRpcProvider(jsonRpcURL, chainId);
const router = new AlphaRouter({chainId, provider: jsonRpcClient});

app.post('/route', (req, res) => {
    const reqBody = req.body;

    const currencyAmount = parseToken(reqBody.currencyAmount, chainId);
    const currency = parseToken(reqBody.currency, chainId);
    const tradeType = reqBody.tradeType as TradeType || TradeType.EXACT_INPUT;

    router.route(CurrencyAmount.fromRawAmount(currencyAmount, reqBody.amount), currency, tradeType)
        .then(route => {
            if (!route) {
                res.status(404);
                res.send("No route found");
                return;
            }
            res.json(route);
        }).catch(err => {
        res.status(500);
        res.send("Internal server error")
        console.log(err);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
