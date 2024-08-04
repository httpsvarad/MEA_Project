"use client"
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized"
import NAV from "../../Navbar"

export default function page() {
  const { data: session } = useSession();
  return (
    <>
    {session?.user?.role === 'admin' ? ( 
    <div className="flex w-full h-screen flex-row text-xl">
      <NAV />
      <div className='flex flex-col w-full gap-5 h-screen'>
        <h1>Events</h1>
        
      </div>
    </div>
    ) : (
      <Unauthorized />
    )}
    </>
  )
}
