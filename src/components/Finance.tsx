import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppContext } from "@/context/AuthProvider"
import './Finance.css'
import useAccountStore from "@/store/useAccountStore";
import { Link } from "react-router";
import MyCard from "@/components/MyCard";

export default function Finance() {
    const { session } = useAppContext();
   
    return (
        <div className="flex mx-auto md:max-w-lg max-w-full flex-col px-4 bg-white items-center min-h-screen gap-2 pb-2">
            <section className="flex flex-col justify-center items-center w-full gap-2">
             {session &&  <MyCard />}
            </section>
            {/* <section className="flex flex-col gap-2 w-full">
            </section> */}
        </div>
    )
}