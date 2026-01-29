import express, { Request, Response } from "express";
import fetch from "node-fetch";

const router = express.Router();

const FMP_BASE_URL = "https://financialmodelingprep.com/stable";
const FMP_API_KEY = process.env.FMP_API_KEY;

router.get("/api/quote/:symbol", async (req: Request<{ symbol: string }>, res: Response) => {
    const { symbol } = req.params;

    try {
        const url = `${FMP_BASE_URL}/quote?symbol=${encodeURIComponent(
            symbol
        )}&apikey=${FMP_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: "FMP error" });
        }
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});



export default router