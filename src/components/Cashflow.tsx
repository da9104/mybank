
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { ChartPie, ChevronDown } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, Rectangle } from "recharts"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
    { month: "January", income: 186, expense: 80 },
    { month: "February", income: 305, expense: 200 },
    { month: "March", income: 237, expense: 120 },
    { month: "April", income: 73, expense: 190 },
    { month: "May", income: 209, expense: 130 },
    { month: "June", income: 214, expense: 140 },
]
const chartConfig = {
    income: {
        label: "Income",
        color: "var(--chart-1)",
    },
    expense: {
        label: "Expense",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig

export default function Cashflow() {

    return (
        <>

            <Card className='ring-0 border border-neutral-100'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                            <ChartPie className='rounded-full' size={18} color='blue' />
                        </div>
                        Cashflow chart
                    </CardTitle>
                    <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                        <Button className='rounded-full bg-white text-black'>
                            2026
                            <ChevronDown size={18} />
                        </Button>
                        <Button className='rounded-full bg-white text-black'>
                            6 MONTH
                            <ChevronDown size={18} />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                    {/* Chart */}
                    <Card className="ring-0"> 
                        <CardContent>
                            <ChartContainer config={chartConfig} className=''>
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={
                                            <ChartTooltipContent
                                                labelFormatter={() => <p className="bg-white font-roboto font-mono text-black rounded-full w-fit px-2 py-1">2026</p>}
                                                className="w-[150px] bg-black/90 text-white gap-2"
                                                formatter={(value, name, item, index) => (
                                                    <div className="flex w-full items-center justify-between gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="h-2.5 w-2.5 rounded-[2px]"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                            <span className="text-muted-foreground whitespace-nowrap">
                                                                {name}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold font-mono font-roboto">
                                                            ${Number(value).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            />
                                        }
                                    />
                                    <Bar
                                        dataKey="income"
                                        stackId="a"
                                        fillOpacity={0.8}
                                        fill="var(--color-income)"   
                                        radius={[0, 0, 4, 4]}
                                        activeBar={({ ...props }) => {
                                            return (
                                                <Rectangle
                                                    {...props}
                                                    className="animate-in fade-in duration-200"
                                                    fillOpacity={1}
                                                    stroke={props.payload.fill}
                                                    strokeDasharray={4}
                                                    strokeDashoffset={4}
                                                    fill="var(--color-income)"
                                                />
                                            )
                                        }}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        stackId="a"
                                        fillOpacity={0.8}
                                        // fill="var(--color-expense)"
                                        radius={[4, 4, 0, 0]}
                                        activeBar={({ ...props }) => {
                                            return (
                                                <Rectangle
                                                    {...props}
                                                    className="animate-in fade-in duration-200"
                                                    fillOpacity={1}
                                                    stroke={props.payload.fill}
                                                    strokeDasharray={4}
                                                    strokeDashoffset={4}
                                                    fill="var(--color-expense)"
                                                />
                                            )
                                        }}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>
        </>
    )
}