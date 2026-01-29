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
import { Settings2, History as HistoryIcon } from 'lucide-react'
import { getQuote } from "../api/fmp";
import { useEffect, useState } from "react";

export default function Stocks() {
    const [stocks, setStocks] = useState<any[]>([]);

    useEffect(() => {
        const fetchStocks = async () => {
            // const isError = sessionStorage.getItem('fmp_api_error') === 'true';
            // if (isError) return;

            const symbols = ['AAPL', 'MSFT'];
            try {
                const promises = symbols.map(symbol => getQuote(symbol));
                const results = await Promise.all(promises);
                const validResults = results.flat().filter((item: any) => item);
                setStocks(validResults);
            } catch (err) {
                console.error(err);
                sessionStorage.setItem('fmp_api_error', 'true');
            }
        };

        fetchStocks();
    }, []);

    return (
        <>
            <Card className='ring-0 border border-neutral-100'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                            <HistoryIcon className='rounded-full' size={18} color='blue' />
                        </div>
                        Stock Quotes
                    </CardTitle>
                    <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                        <Button className='rounded-full bg-white text-black w-8 h-8'>
                            <Settings2 size={18} />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>

                    <Table>
                        <TableHeader>
                            <TableRow className="uppercase">
                                <TableHead>Symbol</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Change</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stocks.map((stock) => (
                                <TableRow key={stock.symbol}>
                                    <TableCell className="font-medium">{stock.symbol}</TableCell>
                                    <TableCell>${stock.price}</TableCell>
                                    <TableCell className={`text-right ${stock.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage?.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                            {stocks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-4">
                                        Loading stocks...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </>
    )
}