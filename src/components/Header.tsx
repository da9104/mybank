import './Header.css'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppContext } from '@/context/AuthProvider';
import useAccountStore from '@/store/useAccountStore'

import { handleGoogleSignIn } from '@/lib/supabase'

export default function Header() {
    const [open, setOpen] = useState(false)
    const { session } = useAppContext();
    const { account } = useAccountStore();

    return (
        <div className="header">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button className="icon-btn" onClick={() => console.log('clicked')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                    </Button>
                </SheetTrigger>
                <SheetContent side="top" className="bg-white border-0!  text-black md:max-w-lg max-w-full mx-auto animate-slide-in-top">
                    <SheetHeader>
                        <SheetTitle>
                            <div className="brand-text text-black">My Bank</div>
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 px-4">

                        <ul className="flex flex-col gap-1 uppercase">
                            <li>Dashboard</li>
                            <li>Accounts</li>
                            <li>Transactions</li>
                            <li>Settings</li>
                        </ul>

                    </div>
                    <SheetFooter>
                        {/* #c3fd28 */}
                        {!session && <Button className='bg-[#2563eb] text-white hover:bg-[#c3fd28] hover:text-black pointer-cursor'>
                            <a href='/my-profile'>Login</a>
                        </Button>}
                        <SheetClose asChild>
                            <Button>Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <div className="brand-text text-black">My Bank</div>
            <button className={session ? "user-icon-btn relative" : "icon-btn relative"}>
                {
                    session ? <img src={session.user.user_metadata.avatar_url}
                        alt={session.user.user_metadata.name}
                        className='w-6 h-6 rounded-full' />
                        : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                }
                <div className="badge-dot"></div>
            </button>
        </div >
    )
}