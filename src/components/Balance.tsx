import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState, useRef } from "react"
import { Button } from '@/components/ui/button'
import { WalletMinimal, Eye, EyeOff, Plus, ArrowUp, ArrowDown, ArrowRight, ChevronDown, Settings, TrashIcon } from 'lucide-react'
import { useAppContext } from '@/context/AuthProvider'
import useAccountStore from '@/store/useAccountStore'
import { Link, useNavigate, useParams } from "react-router-dom"
import DeleteAccountDialog from "@/components/DeleteAccountDialog"

export default function Balance() {
    const { session } = useAppContext();
    const { accounts, fetchUserAccount, deleteAccount, fetchAllAccounts, createAccount, loading, setActiveAccountById } = useAccountStore();
    const [showBalance, setShowBalance] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const navigate = useNavigate();

    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (session?.user?.id) {
            // fetchUserAccount(session.user.id);
            fetchAllAccounts();
        }
    }, [session]);

    useEffect(() => {
        // When accounts are loaded, scroll to the start to show the first account
        if (accounts && accounts.length > 0 && trackRef.current) {
            trackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [accounts]);

    const toggleViewBalance = (prev: boolean) => {
        setShowBalance(!prev);
    }

    const handleCreateAccount = async () => {
        if (session?.user?.id) {
            setDialogOpen(false);
            await createAccount();
        }
    }

    const handleDeleteAccount = async (id: string) => {
        const success = await deleteAccount(id);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="carousel-wrapper">
            <div className="carousel-track" ref={trackRef}>
                {accounts && accounts.length > 0 && accounts.map((account, index) => (
                    <Card key={account.id} className='ring-0 border border-neutral-100 product-card group' >
                        <input type="checkbox" id={`product-${index + 1}`} className="hidden flip-checkbox" />
                        <div className='flip-card-inner flex flex-col gap-4'>
                            <CardHeader>
                                <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                                        <WalletMinimal className='rounded-full' size={18} color='blue' />
                                    </div>
                                    My balance {index + 1}
                                </CardTitle>
                                {session &&
                                    <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                                        <Button className='rounded-full bg-white text-black'>
                                            <img src="/icons/usa.svg" alt="USA Dollar" className='w-4 h-4 rounded-full' />
                                            USD
                                            {/* <ChevronDown size={18} /> */}
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button className='rounded-full bg-white text-black transition duration-300 hover:text-red-500'>
                                                    <Settings size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side='bottom' align='end'>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedAccountId(account.id);
                                                        setDeleteDialogOpen(true)
                                                    }}
                                                    variant="destructive"
                                                    className="cursor-pointer">
                                                    <TrashIcon />
                                                    Close
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardAction>
                                }
                            </CardHeader>
                            {session ? <CardContent className='flex flex-col gap-3'>
                                <CardDescription className='flex flex-row items-center gap-2'>
                                    <p className='font-roboto text-4xl font-bold text-black font-georama'>
                                        {showBalance ? "######" : <span>${account?.balance.toFixed(2)}</span>}
                                    </p>
                                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                                        {showBalance ? <EyeOff className='rounded-full cursor-pointer' size={18} color='blue' onClick={() => toggleViewBalance(showBalance)} />
                                            : <Eye className='rounded-full cursor-pointer' size={18} color='blue' onClick={() => toggleViewBalance(showBalance)} />}
                                    </div>
                                </CardDescription>
                                <p className='py-1 px-2 w-fit rounded-full bg-linear-to-r from-green-200 to-white'>
                                    +12% Blanace increase, Good progress.
                                </p>
                            </CardContent>
                                : <CardContent>
                                    Please login to view your balance
                                </CardContent>
                            }
                            <CardFooter className='absolute bottom-0 self-end border-0 flex flex-row items-center gap-2 w-full overflow-x-auto no-scrollbar bg-transparent'>
                                {session ? (
                                    <>
                                        <Button className='cursor-pointer rounded-full bg-black text-white px-6 py-4'>
                                            <Link to={`/transfer-money/add/${account.id}`}
                                                className="flex flex-row items-center gap-2"
                                                onClick={() => setActiveAccountById(account.id)}>
                                                <Plus />  Add money
                                            </Link>
                                        </Button>
                                        <Button className='cursor-pointer rounded-full bg-[#0161FB] text-white px-6 py-4'>
                                            <Link to={`/transfer-money/withdraw/${account.id}`}
                                                className="flex flex-row items-center gap-2"
                                                onClick={() => setActiveAccountById(account.id)}>
                                                <ArrowUp /> Send money
                                            </Link>
                                        </Button>
                                        <Button className='cursor-pointer rounded-full bg-gray-100  text-black px-6 py-4'>
                                            <Link to={'#'} className="flex flex-row items-center gap-2">
                                                <ArrowDown />  Request money
                                            </Link>
                                        </Button>
                                    </>
                                ) : <Button className='cursor-pointer rounded-full bg-gray-100 px-6 text-black'>
                                    <Link to='/my-profile' className="flex flex-row items-center gap-2">
                                        Sign up with Google
                                        <ArrowRight />
                                    </Link>
                                </Button>
                                }
                            </CardFooter>
                        </div>
                    </Card>
                ))}

                {/* Create a new account card */}
                <Card className='ring-0 border border-neutral-100 product-card group px-4 py-4' >
                    <input type="checkbox" id="product-2" className="hidden flip-checkbox" />
                    <div className="flip-card-inner">
                        <div className="card-face card-front">
                            <div className="image-area">
                                <div className="image-overlay"></div>
                                <div className="brand-tag">New</div>

                                <img src="/images/v0card4.png" className="product-img" alt="card front" />
                            </div>
                            <div className='card-content'>
                                <div className='flex flex-col gap-2'>
                                    <h1 className='md:text-2xl text-lg font-bold text-white font-georama'> Create a new saving account </h1>
                                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                                disabled={loading}
                                                className='bg-[var(--colour-brand)] text-white hover:bg-[var(--colour-secondary)]! cursor-pointer! z-100!'>
                                                Create account
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Create a new saving account</DialogTitle>
                                                <DialogDescription>
                                                    Your saving account will be created in a second.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="">
                                                <Button onClick={handleCreateAccount} className="flex-1 w-full py-2 bg-[var(--colour-brand)] text-white">Continue</Button>
                                                <DialogClose>
                                                    <Button variant="outline" className="flex-1 w-full py-2">Cancel</Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            <DeleteAccountDialog
                handleDeleteAccount={() => handleDeleteAccount(selectedAccountId ?? '')}
                deleteDialogOpen={deleteDialogOpen}
                setDeleteDialogOpen={setDeleteDialogOpen}
            />
        </div >
    )
}