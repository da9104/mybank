import { House, UserRound, CircleDollarSign, Search } from "lucide-react"
import { Link } from "react-router-dom"

export default function NavBar() {
    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-100 bg-white backdrop-blur
             mx-auto max-w-lg text-black"
        >
            <div className="flex items-center justify-between px-4 py-2 text-sm">
                <button className="flex flex-col justify-center items-center">
                    <Link to='/' className="flex flex-col items-center">
                        <House />
                        <span className="text-xs">Home</span>
                    </Link>
                </button>
                <button className="">
                    <Link to='/finance' className="flex flex-col items-center">
                        <CircleDollarSign />
                        <span className="text-xs">Finance</span>
                    </Link>
                </button>
                <button className="">
                    <Link to='/search' className="flex flex-col items-center">
                        <Search />
                        <span className="text-xs">Search</span>
                    </Link>
                </button>
                <button className="">
                    <Link to='/my-profile' className="flex flex-col items-center">
                        <UserRound />
                        <span className="text-xs">Profile</span>
                    </Link>
                </button>
            </div>
        </nav>
    )
}