
export const getQuote = async (symbol: string) => {
    try {
        const response = await fetch(`https://financialmodelingprep.com/stable/quote?symbol=${symbol}&apikey=${import.meta.env.VITE_FMP_API_KEY}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // The API returns an array, usually [ { ... } ]
    } catch (error) {
        console.error("Failed to fetch quote:", error);
        return null;
    }
};

export const getIndex = async (symbol: string) => {
    try {
        const url = `https://financialmodelingprep.com/stable/historical-price-eod/full?symbol=${encodeURIComponent(
            symbol
        )}&apikey=${import.meta.env.VITE_FMP_API_KEY}`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`FMP error ${res.status}`);
        const json = await res.json();
        const data = json.historical || json; // Handle both { historical: [...] } and [...]

        console.log(data);
        return { symbol, data };

    } catch (error) {
        console.error("Failed to fetch index:", error);
        return null;
    }
}
