import Login from "@/components/Login"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { LogOut, UserPen } from "lucide-react"
import { useAppContext } from '@/context/AuthProvider';
import { supabase } from '@/lib/supabase';
import MyCard from "@/components/MyCard";

export default function MyProfile() {
    const { session, randomUsername, setUsername } = useAppContext();

    const handleLogout = async () => {
        console.log('logout')
        const { error } = await supabase.auth.signOut();
        if (error) return console.error("error signOut", error);
        const username = randomUsername();
        setUsername(username);
        localStorage.setItem("username", username);
    }

    return (
        <main className="flex mx-auto md:max-w-lg max-w-full flex-col px-4 bg-white items-center justify-center min-h-screen">
            {!session ? <Login /> : (
                <section className="flex-1 flex flex-col gap-2 overflow-y-auto pb-25 container bg-white text-black">

                    <Card className='ring-0 border border-neutral-100'>
                        <CardHeader>
                            <h1 className='font-georama text-2xl font-bold'>My Profile</h1>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={session?.user.user_metadata.avatar_url}
                                alt={session?.user.user_metadata.name}
                                className='w-12 h-12 rounded-full'
                            />
                            <h3>{session.user.user_metadata.name}</h3>
                            <p className="font-roboto">{session.user.email}</p>
                            <p>Joined {new Date(session.user.created_at).toLocaleDateString('en-GB')}</p>
                        </CardContent>
                        <CardFooter className="flex flex-row items-center justify-center border-0 gap-2 w-full">
                            <Button className='flex-1 cursor-pointer flex flex-row items-center justify-center gap-2 rounded-full border border-[var(--colour-brand)] hover:border-[var(--colour-secondary)] bg-[var(--colour-brand)] hover:bg-[var(--colour-secondary)] hover:text-black'>
                                <UserPen />  Edit Profile
                            </Button>
                            <Button onClick={handleLogout} className='flex-1 cursor-pointer flex flex-row items-center justify-center gap-2 rounded-full border border-[var(--colour-brand)] hover:border-[var(--colour-secondary)] bg-[var(--colour-brand)] hover:bg-[var(--colour-secondary)] hover:text-black'>
                                <LogOut /> Logout
                            </Button>
                        </CardFooter>
                    </Card>
                    <MyCard />
                </section>
            )}

        </main>
    )
}