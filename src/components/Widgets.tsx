
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowBigUpDash, ArrowBigDownDash, ChevronDown, TrendingUp } from "lucide-react"

export default function Widgets() {
    return (
        <div className='grid grid-cols-2 gap-1 w-full'>

            <Card className='ring-0 border border-neutral-100  md:w-[235px] w-full'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#1447e6] p-1'>
                            <ArrowBigDownDash className='rounded-full' size={18} color='white' />
                        </div>
                        Income
                    </CardTitle>
                    <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                        <Button className='rounded-full bg-white text-black w-8 h-8'>

                            <ChevronDown size={18} />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                    <CardDescription className='flex flex-row items-center gap-2'>
                        <p className='font-roboto text-4xl font-bold text-black font-georama'>$5,000</p>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                            <TrendingUp className='rounded-full' size={18} color='green' />
                        </div>
                    </CardDescription>
                    <p className='py-1 px-2 w-fit rounded-full bg-linear-to-r from-green-200 to-white text-xs'>
                        +9.1% from last month
                    </p>

                </CardContent>
                <CardFooter className='border-0 flex flex-row items-center gap-4 w-full overflow-x-auto no-scrollbar'>
                    <div className='flex flex-col border-l-2 border-l-[#1447e6] pl-2'>
                        <p className='font-roboto text-xs  text-black font-georama'>Salay</p>
                        <p className='font-roboto text-sm text-black font-georama'>{" "}$3,000</p>
                    </div>
                    <div className='flex flex-col border-l-2 border-l-[#c3fd28] pl-2'>
                        <p className='font-roboto text-xs  text-black font-georama'>Freelance</p>
                        <p className='font-roboto text-sm text-black font-georama'>{" "}$3,000</p>
                    </div>
                </CardFooter>
            </Card>

            <Card className='ring-0 border border-neutral-100 md:w-[235px] w-full'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-red-500 p-1'>
                            <ArrowBigUpDash className='rounded-full' size={18} color='white' />
                        </div>
                        Expenses
                    </CardTitle>
                    <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                        <Button className='rounded-full bg-white text-black w-8 h-8'>
                            <ChevronDown size={18} />
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                    <CardDescription className='flex flex-col gap-2'>
                        <p className='font-roboto text-4xl font-bold text-black font-georama'>$4,000 <span className='text-xs'>.00</span></p>

                        <div className="flex flex-row items-center rounded-full border border-gray-100 bg-gray-100 text-xs gap-1">
                            <div className='flex flex-row items-center gap-1 py-1 px-2 w-fit rounded-full border border-gray-100 bg-white'>
                                <div className='flex items-center justify-center w-4 h-4 rounded-full bg-red-500 p-1'>
                                    <TrendingUp className='rounded-full' color='white' />
                                </div>
                                <p> $456 </p>
                            </div>
                            {" "} vs last month
                        </div>
                    </CardDescription>
                </CardContent>
            </Card>


        </div >
    )
}