"use client"
import { useSession } from "next-auth/react";
import Unauthorized from "../../Unauthorized"

export default function page() {
  const { data: session } = useSession();
  return (
    <div>
      {session?.user?.role === 'admin' ? (
        <h1>gallery admin</h1>
      ) : (
        <Unauthorized />
      )}
    </div>
  )
}
