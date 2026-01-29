import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useAccountStore from "@/store/useAccountStore";
import { useNavigate, Link } from "react-router-dom"
import { useAppContext } from "@/context/AuthProvider"

import DeleteAccountDialog from "@/components/DeleteAccountDialog";
import { type Account } from '@/store/useAccountStore';

export default function MyCard() {
    const { session } = useAppContext();
    const navigate = useNavigate();
    const { account, accounts, loading, fetchAllAccounts, deleteAccount, fetchUserAccount, createAccount } = useAccountStore();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (session?.user?.id) {
            fetchAllAccounts();
        }
    }, [session]);

    const handleCreateAccount = async () => {
        await createAccount();
    };

    const handleDeleteAccount = async () => {
        const success = await deleteAccount(selectedAccount?.id);
        if (success) {
            navigate('/finance');
        }
    };

    return (
        <div className="carousel-wrapper ">
            <div className="carousel-track" ref={trackRef}>
                {accounts && accounts.length > 0 ? accounts.map((account, index) => (
                    <Card key={index} className='ring-0 border border-neutral-100 w-full h-full! product-card group'>
                        <CardContent className="relative bg-transparent">
                            <div className="product-card group">
                                <input type="checkbox" id={`product-${index + 1}`} className="hidden flip-checkbox" />
                                <div className="flip-card-inner">
                                    <div className="card-face card-front">
                                        <label htmlFor={`product-${index + 1}`} className="front-trigger"></label>
                                        <div className="image-area">
                                            <div className="image-overlay"></div>
                                            <Button className="heart-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                            </Button>
                                            <img src="/images/v0card2.png" className="product-img" alt="v0 credit card front" />
                                        </div>
                                        <div className="front-content">
                                            <div>
                                                {session && account ? (
                                                    <div>
                                                        <h3 className='font-bold text-xl text-white'>Your Balance</h3>
                                                        <p className='text-white text-3xl font-bold mt-1'>
                                                            ${Number(account.balance).toLocaleString()}
                                                        </p>
                                                        <p className='text-white/70 text-xs uppercase mt-2 font-medium tracking-wider'>
                                                            {account.account_number}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <h3 className='font-bold text-xl text-white'>Your Balance</h3>
                                                        <p className='text-white/50 text-sm uppercase mt-1 font-medium'>No balance yet</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-face card-back">
                                        <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                                Account Details
                                            </span>
                                            <label htmlFor={`product-${index + 1}`} className="close-btn z-[100]!">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </label>
                                        </div>
                                        <h3 className="details-title">
                                            {session && account ? <span className="text-green-300">Account Active</span> : <span className="text-white">Create your account today</span>}
                                        </h3>
                                        <p className="details-desc">
                                            {session && account
                                                ? "Your premium MyBank account is active and ready for use."
                                                : "Your account will be created in a minute with a $100 sign-up bonus."}
                                        </p>

                                        <div>
                                            {session && account && <>
                                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                                                    Card settings
                                                </span>
                                                <div className="w-full flex flex-col gap-2">
                                                    <Button className="add-money-btn" >
                                                        Add Money
                                                    </Button>
                                                    <Button className="transfer-money-btn">
                                                        Transfer Money
                                                    </Button>
                                                    <Button
                                                        className="delete-btn"
                                                        onClick={() => {
                                                            setSelectedAccount(account);
                                                            setDeleteDialogOpen(true);
                                                        }}>
                                                        Delete Account
                                                    </Button>
                                                    <DeleteAccountDialog handleDeleteAccount={handleDeleteAccount} deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} />
                                                </div>
                                            </>
                                            }
                                        </div>

                                        {!account && (
                                            <div className="cart-container">
                                                <button
                                                    className="create-btn cursor-pointer"
                                                    onClick={handleCreateAccount}
                                                    disabled={loading}
                                                >
                                                    <span className="create-btn-text-select">
                                                        {/* create account */}
                                                        {session && loading ? "Creating..." : <Link to="/">Create account</Link>}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className='border-0 flex flex-row items-center gap-2 w-full overflow-x-auto no-scrollbar'>
                            <Button className='cursor-pointer rounded-full bg-gray-100 px-12 text-black'>
                                <a href="/my-profile" className="flex flex-row items-center gap-2">
                                    Setting account
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                )) : (
                    <Card className='ring-0 border border-neutral-100 w-full h-full! product-card group'>
                        <CardContent className="relative bg-transparent">
                            <div className="product-card group">
                                <input type="checkbox" id={`product-1`} className="hidden flip-checkbox" />
                                <div className="flip-card-inner">
                                    <div className="card-face card-front">
                                        <label htmlFor={`product-1`} className="front-trigger"></label>
                                        <div className="image-area">
                                            <div className="image-overlay"></div>
                                            <Button className="heart-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                                            </Button>
                                            <img src="/images/v0card2.png" className="product-img" alt="v0 credit card front" />
                                        </div>
                                        <div className="front-content">
                                            <div>
                                                <div>
                                                    <h3 className='font-bold text-xl text-white'>Your Balance</h3>
                                                    <p className='text-white/50 text-sm uppercase mt-1 font-medium'>No balance yet</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card-face card-back">
                                        <div className="flex justify-between items-center" style={{ marginBottom: "16px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                                Account Details
                                            </span>
                                            <label htmlFor={`product-1`} className="close-btn z-[100]!">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </label>
                                        </div>
                                        <h3 className="details-title">
                                            <span className="text-white">Create your account today</span>
                                        </h3>
                                        <p className="details-desc">
                                            Your account will be created in a minute with a $100 sign-up bonus.
                                        </p>

                                        <div>
                                            {session && account && <>
                                                <span style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                                                    Card settings
                                                </span>
                                                <div className="w-full flex flex-col gap-2">
                                                    <Button className="add-money-btn" >
                                                        Add Money
                                                    </Button>
                                                    <Button className="transfer-money-btn">
                                                        Transfer Money
                                                    </Button>
                                                    <Button
                                                        className="delete-btn"
                                                        onClick={() => {
                                                            setSelectedAccount(account);
                                                            setDeleteDialogOpen(true);
                                                        }}>
                                                        Delete Account
                                                    </Button>
                                                    <DeleteAccountDialog handleDeleteAccount={handleDeleteAccount} deleteDialogOpen={deleteDialogOpen} setDeleteDialogOpen={setDeleteDialogOpen} />
                                                </div>
                                            </>
                                            }
                                        </div>

                                        {!account && (
                                            <div className="cart-container">
                                                <button
                                                    className="create-btn cursor-pointer"
                                                    onClick={handleCreateAccount}
                                                    disabled={loading}
                                                >
                                                    <span className="create-btn-text-select">
                                                        {session && loading ? "Creating..." : <Link to="/">Create account</Link>}
                                                    </span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className='border-0 flex flex-row items-center gap-2 w-full overflow-x-auto no-scrollbar'>
                            <Button className='cursor-pointer rounded-full bg-gray-100 px-12 text-black'>
                                <a href="/my-profile" className="flex flex-row items-center gap-2">
                                    Setting account
                                </a>
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}