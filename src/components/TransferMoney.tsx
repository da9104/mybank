import { Button } from "@/components/ui/button"
import { useAppContext } from '@/context/AuthProvider';
import useAccountStore from '@/store/useAccountStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react";


export default function TransferMoney({ type }: { type: string }) {
    const { session } = useAppContext();
    const { account, fetchUserAccount, addMoney, withdrawMoney } = useAccountStore();
    const [form, setForm] = useState({
        amount: '',
        description: '',
    });

    useEffect(() => {
        fetchUserAccount();
    }, [session]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (type === 'ADD') {
            addMoney(Number(form.amount), form.description);
        } else {
            withdrawMoney(Number(form.amount), form.description);
        }
    }
    return (
        <main className='flex mx-auto md:max-w-lg max-w-full flex-col px-4 bg-white min-h-screen'>
            {/* Request Money */}

            <Card className="flex flex-col gap-2">
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>{type === 'ADD' ? 'Add Money' : 'Withdraw Money'}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pb-4">
                        {/* {session?.user.user_metadata.name}
                    <img
                        src={session?.user.user_metadata.avatar_url}
                        alt={session?.user.user_metadata.name}
                        className='w-10 h-10 rounded-full'
                    /> */}
                        <div className="flex flex-row gap-2 justify-between items-center">
                            {session && <>
                                <p>{account?.account_number}</p>
                                <div className="flex flex-row justify-center items-center gap-2">
                                    <p className="text-sm">Balance: </p>
                                    <p className="text-xl font-bold font-georama">{session && `$${account?.balance!}`}</p>
                                    <p>{account?.currency}</p>
                                </div>
                            </>
                            }
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="amount">Enter amount</label>
                            <input type="number" name='amount' onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" className='flex-1 ring-0 ring-offset-0 border-2 border-neutral-100 focus:border-[var(--colour-brand)] focus:ring-[var(--colour-brand)] focus:ring-1 rounded-full p-2 w-full' />
                        </div>
                        <div className="flex flex-col gap-2">
                            {/* <label htmlFor="recipient">Enter recipient</label>
                        <input placeholder="Enter email address" className='flex-1 ring-0 ring-offset-0 border-2 border-neutral-100 focus:border-[var(--colour-brand)] focus:ring-[var(--colour-brand)] focus:ring-1 rounded-full p-2 w-full' /> */}
                            <label htmlFor="note">Notes <span className='text-gray-400'>(optional)</span> </label>
                            <input type="text" onChange={(e) => setForm({ ...form, description: e.target.value })} name='description' placeholder="Notes" className='flex-1 ring-0 ring-offset-0 border-2 border-neutral-100 focus:border-[var(--colour-brand)] focus:ring-[var(--colour-brand)] focus:ring-1 rounded-full p-2 w-full' />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-row gap-2 justify-center ">
                        <Button
                            className='flex-1 rounded-full py-4 bg-[var(--colour-brand)] hover:bg-[var(--colour-brand)] transition-all duration-75'
                            type="submit"
                        >
                            {type === 'ADD' ? 'Add money' : 'Withdraw'}
                        </Button>
                        <Button type="button" className='flex-1 rounded-full py-4 '>Cancel</Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}