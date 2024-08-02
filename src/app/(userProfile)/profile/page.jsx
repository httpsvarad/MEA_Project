'use client'
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Page() {
    const { data: session } = useSession();

    return (
        <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-4 text-gray-800">
                    Hello {session?.user?.name}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                    Email: {session?.user?.email}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                    contact: {session?.user?.contactNumber}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                    Designation: {session?.user?.designation}
                </p>
                <p className="text-lg text-gray-600 mb-6">
                    Role: {session?.user?.role}
                </p>
                <button
                    onClick={() => signOut()}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                    Sign Out
                </button>
            </div>
        </div>
        </>
    )
}
