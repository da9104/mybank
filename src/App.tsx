import { Routes, Route, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useThemeStore from '@/store/useThemeStore';
import { AuthProvider, useAppContext } from '@/context/AuthProvider';
import { Toaster } from '@/components/ui/sonner'
import NavBar from '@/components/NavBar'
import Header from '@/components/Header'
import Goals from '@/components/Goals'
import Balance from '@/components/Balance'
import './App.css'
import Cashflow from '@/components/Cashflow'
import TransactionHistory from '@/components/TransactionHistory'
import Widgets from '@/components/Widgets'
import Stocks from '@/components/Stocks'
import IndexCard from '@/components/IndexCard'
import MyProfile from '@/components/MyProfile'
import Search from '@/components/Search'
import Finance from '@/components/Finance'
import TransferMoney from '@/components/TransferMoney'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Plus, ArrowUpRight } from 'lucide-react'

function Layout() {
  const { theme } = useThemeStore();

  return (
    <main className={`min-h-screen mx-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <header className="flex mx-auto md:max-w-lg max-w-full flex-col px-4 py-3 bg-white">
        <Header />
      </header>
      <Outlet />
      <NavBar />
    </main>
  )
}


function App() {

  // const { session } = useAppContext();

  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        {/* Public login route - no layout */}
        <Route path="/login" element={<MyProfile />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/search" element={<Search />} />
          <Route path="/finance" element={<Finance />} />

          <Route path="/transfer-money/add/:account_id" element={<TransferMoney type='ADD' />} />
          <Route path="/transfer-money/withdraw/:account_id" element={<TransferMoney type='WITHDRAW' />} />

        </Route>
      </Routes>
    </AuthProvider>
  )
}


function Home() {
  const { session } = useAppContext();

  useEffect(() => {
    console.log('Current Session:', session);
  }, [session]);

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen md:max-w-lg max-w-full flex-col ">
        <section className="flex-1 flex flex-col gap-2 overflow-y-auto px-4 pb-25 container bg-white text-black">

          {session && <>
            <Balance />
            <Goals />
            <Cashflow />
            <IndexCard />
            <TransactionHistory />
            <Widgets />
            <Stocks />
          </>}

          {!session && <a href="/my-profile" className='group'>
            <Card className='ring-0 border-0 relative overflow-hidden  bg-black'>

              <CardHeader className="relative z-10">
                <CardTitle className='font-roboto flex flex-row items-center gap-2'>
                </CardTitle>
                <CardAction className='rounded-full bg-gray-100 flex flex-row items-center gap-1 p-1'>
                  <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 p-1'>
                    <ArrowUpRight className='rounded-full' size={18} color='blue' />
                  </div>
                </CardAction>
              </CardHeader>
              <div className='relative bg-black'>
                <img src='/images/main.svg' alt='main' />
              </div>
              <CardContent className='relative z-10 flex flex-col gap-3'>
                <p className='text-black px-6 py-1 rounded-full bg-white w-fit'>Invest your future</p>
                <p className='text-white font-georama font-bold text-2xl'>Get started Mybank</p>
              </CardContent>
              <CardFooter className='bg-transparent relative z-10 flex flex-row items-center gap-2 w-full'>
                <Button className='text-black font-roboto font-light  text-md uppercase w-1/3 py-6 border border-gray-800 bg-white hover:bg-gray-100 transition-all duration-75'>Log in</Button>
                <Button className='text-white font-roboto font-light  text-md uppercase w-2/3 py-6 hover:bg-[var(--colour-secondary)]  transition-all duration-75'>Create account</Button>
              </CardFooter>
            </Card>
          </a>
          }

        </section>
      </div>
    </main >
  )
}

export default App
