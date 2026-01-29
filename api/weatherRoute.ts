// server/weatherRoute.ts
import express from "express";
import fetch from "node-fetch";

interface WeatherData {
    currentTemp: number;
    high: number;
    low: number;
    condition: string;
    icon: string;
    city: string;
    daily: {
        dayOffset: number;
        temp: number;
        icon: string;
    }[];
}

const router = express.Router();

const BASE = process.env.VITE_WEATHER_API_BASE || "https://api.openweathermap.org";
// const API_KEY = process.env.WEATHER_API_KEY; // API_KEY is now lazy-loaded inside the route

router.get("/api/weather", async (req, res) => {
    try {
        const API_KEY = process.env.WEATHER_API_KEY;
        if (!API_KEY) {
            console.error("[Weather] Server missing WEATHER_API_KEY environment variable.");
            return res.status(500).json({ error: "Server missing WEATHER_API_KEY" });
        }

        const { lat, lon } = req.query; // e.g. ?lat=37.45&lon=126.73
        console.log(`[Weather] Requesting for lat=${lat} lon=${lon}`);
        console.log(`[Weather] Using API Key: ${API_KEY ? API_KEY.slice(0, 4) + '***' : 'MISSING'}`);

        // Use 5-day forecast endpoint to get both 'current' (first item) and 5-day history
        const url = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        const r = await fetch(url);

        console.log(`[Weather] OWM Response Status: ${r.status}`);

        if (!r.ok) {
            const text = await r.text();
            console.error(`[Weather] OWM Error: ${r.status} ${text}`);
            return res.status(r.status).json({ error: "weather api error", details: text });
        }

        const data = await r.json() as any;

        // "Current" roughly equals the first item in the forecast list (closest 3h slot)
        const current = data.list[0];

        // "Daily": Sample every 24h (every 8th item of 3h intervals)
        const dailyPoints = data.list.filter((_: any, i: number) => i % 8 === 0).slice(0, 5);

        const responseData: WeatherData = {
            currentTemp: Math.round(current.main.temp),
            high: Math.round(current.main.temp_max), // approx from first 3h block
            low: Math.round(current.main.temp_min),  // approx from first 3h block
            condition: current.weather[0].main,
            icon: current.weather[0].icon,
            city: data.city.name,
            daily: dailyPoints.map((d: any, i: number) => ({
                dayOffset: i,
                temp: Math.round(d.main.temp),
                icon: d.weather[0].icon,
            })),
        };

        res.json(responseData);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "server error" });
    }
});

export default router;
