import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Settings2, ChartNoAxesCombined } from 'lucide-react'
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { getIndex } from "../api/fmp";

interface IndexData {
    symbol: string;
    last: number;
    change: number;
    changePct: number;
    chart: { date: string; price: number }[];
}

const CACHE_KEY = "market_indices_cache";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export default function IndexCard() {
    const [stocks, setStocks] = useState<IndexData[]>([]);

    useEffect(() => {
        const fetchIndex = async () => {
            // Check cache
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { timestamp, data } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_DURATION) {
                    setStocks(data);
                    return;
                }
            }

            const symbols = ["^GSPC", "^IXIC", "^DJI", "^VIX"];
            try {
                const results = await Promise.all(symbols.map(getIndex));
                const normalize = (entry: { symbol: string; data: any[] }) => {
                    const series = entry.data;
                    if (!series?.length) return null;

                    const latest = series[0];
                    const prev = series[1] ?? latest;

                    const last = latest.close ?? latest.price;
                    const prevClose = prev.close ?? prev.price;

                    const change = last - prevClose;
                    const changePct = prevClose ? (change / prevClose) * 100 : 0;

                    // reverse to go oldest -> newest for charts
                    const chart = series
                        .slice(0, 30)
                        .slice()
                        .reverse()
                        .map((d: any) => ({
                            date: d.date,
                            price: d.close ?? d.price,
                        }));

                    return {
                        symbol: entry.symbol,
                        last,
                        change,
                        changePct,
                        chart,
                    };
                }

                const payload: IndexData[] = [];
                for (const r of results) {
                    if (!r) continue;
                    const normalized = normalize(r);
                    if (normalized) {
                        payload.push(normalized);
                    }
                }

                setStocks(payload);
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    data: payload
                }));

            } catch (err) {
                console.error(err);
            }
        };

        fetchIndex();
    }, []);

    const getLabel = (symbol: string) => {
        switch (symbol) {
            case "^GSPC": return "S&P 500";
            case "^IXIC": return "Nasdaq";
            case "^DJI": return "Dow Jones";
            case "^VIX": return "Volatility";
            default: return symbol;
        }
    };

    // if (stocks.length === 0) return null;

    return (
        <Card className="flex flex-col gap-4">
            <CardHeader>
                <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                        <ChartNoAxesCombined className='rounded-full' size={18} color='blue' />
                    </div>
                    Index
                </CardTitle>
                <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                    <Button className='rounded-full bg-white text-black w-8 h-8'>
                        <Settings2 size={18} />
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className='flex flex-col'>
                {stocks.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-xl border p-4 h-[120px] animate-pulse bg-gray-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {stocks.map((data) => {
                            const isUp = data.change >= 0;
                            return (
                                <div key={data.symbol} className="rounded-xl border bg-card p-4">
                                    <div className="flex items-baseline justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{getLabel(data.symbol)}</p>
                                            <p className="text-lg font-semibold">
                                                {data.last.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className={isUp ? "text-emerald-500" : "text-red-500"}>
                                            <p className="text-sm text-right">
                                                {isUp ? "↑" : "↓"} {data.changePct.toFixed(2)}%
                                            </p>
                                            <p className="text-xs text-right">
                                                {isUp ? "+" : ""}
                                                {data.change.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-2 h-16">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={data.chart}>
                                                <Area
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke={isUp ? "#16a34a" : "#dc2626"}
                                                    fill={isUp ? "rgba(22,163,74,0.15)" : "rgba(220,38,38,0.15)"}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}