import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search as SearchIcon, Settings2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import WeatherCard from "@/components/WeatherCard"

const stocks = [
    {
        symbol: 'AAPL',
        price: 150,
        changePercentage: 1.5,
    },
    {
        symbol: 'MSFT',
        price: 300,
        changePercentage: -0.5,
    },
]

export default function Search() {
    return (
        <div className="flex mx-auto md:max-w-lg max-w-full flex-col px-4 bg-white items-center min-h-screen gap-2 pb-2">
            <section className="flex flex-row justify-center items-center w-full">
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 ring-0 ring-offset-0 border-2 border-neutral-100 focus:border-[var(--colour-brand)] focus:ring-[var(--colour-brand)] focus:ring-1 rounded-full p-2 " />
                <SearchIcon />
            </section>

            <WeatherCard />
            <section className="flex flex-col gap-2 w-full">
                <Card className='ring-0 border border-neutral-100'>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                            Watch lists
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stocks.map((stock) => (
                                    <TableRow key={stock.symbol}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-row items-center gap-4">
                                                <img src="/icons/usa.svg" alt="USA Dollar" className='w-6 h-6 rounded-full' />
                                                <div className="flex flex-col items-start">
                                                    <p className='font-roboto font-bold'>{stock.symbol}</p>
                                                    <span className="text-xs text-gray-500">{stock.symbol}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className={`text-right ${stock.changePercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {stock.changePercentage > 0 ? '+' : ''}{stock.changePercentage?.toFixed(2)}%
                                            </p>
                                            <p className="text-right text-xs text-gray-500">${stock.price}</p>
                                        </TableCell>
                                        <TableCell className="text-right w-[1%] whitespace-nowrap">
                                            <div className="flex items-center justify-end">
                                                <Button className="rounded-full bg-white  text-black w-10 h-10">
                                                    <Star className="text-gray-400" size={18} />
                                                </Button>
                                            </div>
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

            </section>


        </div>
    )
}