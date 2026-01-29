
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button'
import { Goal, Plus, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { useAppContext } from '@/context/AuthProvider'


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

const chartData = [{ month: "january", desktop: 1500 }]

export default function Goals() {
    const { session } = useAppContext();
    const totalVisitors = chartData[0].desktop 

    return (
        <>
            <Card className='ring-0 border border-neutral-100 pb-0'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                            <Goal className='rounded-full' size={18} color='blue' />
                        </div>
                        My goals
                    </CardTitle>
                    {session && <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                        <Button className='rounded-full bg-white w-8 h-8 text-black'>
                            <Plus size={18} />
                        </Button>
                        <Button className='rounded-full bg-white w-8 h-8 text-black'>
                            <ChevronDown size={18} />
                        </Button>
                    </CardAction>}
                </CardHeader>
                <CardContent className='border-0 flex flex-col items-center gap-2 w-full bg-gray-100 pb-4 pt-4 '>

                    {/* Chart */}
                    {!session && <Card className="flex flex-col w-full bg-[#2A2A2A] text-white">
                        <CardHeader className="items-center pb-0">
                            <CardTitle className='flex flex-row justify-between items-center'>
                                Reach your goals with mybank
                                {/* <Button className='rounded-full bg-white w-8 h-8 text-black'>
                                    <ChevronUp size={18} />
                                </Button> */}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-1 items-center pb-0">
                            <ChartContainer
                                config={chartConfig}
                                className="mx-auto w-full h-[120px]"
                            >
                                <RadialBarChart
                                    data={chartData}
                                    endAngle={240}
                                    innerRadius={70}
                                    outerRadius={100}
                                    cy="90%"
                                    startAngle={-0}
                                >
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                                labelFormatter={() => <p className="bg-white font-roboto font-mono text-black rounded-full w-fit">
                                                    <Info size={18} />
                                                </p>}
                                                className="w-[150px] bg-black/90 text-white gap-2"
                                                formatter={() => (
                                                    <div className="flex w-full items-center justify-between gap-2">
                                                       please login to view your goals
                                                    </div>
                                                )}
                                            />
                                         }
                                        // content={
                                        //     <ChartTooltipContent hideLabel className='text-black' />
                                        // }
                                    />
                                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                        <Label
                                            content={({ viewBox }) => {
                                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                    return (
                                                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" className='text-white'>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) - 16}
                                                                className=" text-4xl font-bold"
                                                                style={{ fill: "white" }}
                                                            >
                                                                {/* {totalVisitors.toLocaleString()} */}
                                                                0000
                                                            </tspan>
                                                            <tspan
                                                                x={viewBox.cx}
                                                                y={(viewBox.cy || 0) + 4}
                                                                className=""
                                                                style={{ fill: "white" }}
                                                            >
                                                                Target
                                                            </tspan>
                                                        </text>
                                                    )
                                                }
                                            }}
                                        />
                                    </PolarRadiusAxis>
                                    <PolarAngleAxis type="number" domain={[0, 2500]} tick={false} />
                                    <RadialBar
                                        dataKey="desktop"
                                        stackId="a"
                                        cornerRadius={5}
                                        fill="var(--color-desktop)"
                                        className="stroke-transparent stroke-2"
                                    />
                                    <RadialBar
                                        dataKey="mobile"
                                        fill="var(--color-mobile)"
                                        stackId="a"
                                        cornerRadius={5}
                                        className="stroke-2"
                                    />
                                </RadialBarChart>
                            </ChartContainer>
                        </CardContent>

                    </Card>
                    }


                    {session && <div className='flex flex-row items-center gap-1 w-full bg-white rounded-xl p-2'>
                        <p className='py-1 px-2 w-full '>
                            iPhone 17 Pro
                        </p>
                        <div className='flex flex-row items-center gap-2 py-1 px-2 w-full '>
                            <Progress value={33} className='text-[#0161FB] bg-gray-100' />
                            <Button className='rounded-full bg-gray-100 w-8 h-8 text-black'>
                                <ChevronDown size={18} />
                            </Button>
                        </div>
                     </div>
                    }
                </CardContent>
            </Card>

        </>
    )
} 