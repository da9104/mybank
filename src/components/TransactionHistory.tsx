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
import { Settings2, History as HistoryIcon, MoreHorizontalIcon } from 'lucide-react'

export default function TransactionHistory() {
    return (
        <>
            <Card className='ring-0 border border-neutral-100'>
                <CardHeader>
                    <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                        <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                            <HistoryIcon className='rounded-full' size={18} color='blue' />
                        </div>
                        Transaction history
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
                                <TableHead>Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Method</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Wireless Mouse</TableCell>
                                <TableCell>$29.99</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end w-full">
                                        <MoreHorizontalIcon />
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Mechanical Keyboard</TableCell>
                                <TableCell>$129.99</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end w-full">
                                        <MoreHorizontalIcon />
                                    </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">USB-C Hub</TableCell>
                                <TableCell>$49.99</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end w-full">
                                        <MoreHorizontalIcon />
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                </CardContent>
            </Card>
        </>
    )
}