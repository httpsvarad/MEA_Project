import Image from "next/image"
import IMGs from "../../Assets/IMGs/man.png"
import { useSession } from "next-auth/react";


export default function NAV() {
    const { data: session } = useSession();

    return (
    <>
      <div className="w-[15%] shadow-md bg-blue-500 flex flex-col">
        <div className="w-full flex py-2 px-2 flex-col">
            <div className=" w-full flex justify-center items-center">
                <Image 
                className="Admin w-full"
                src={IMGs}
                alt="Admin" />
            </div>
            <div className="w-full flex items-center justify-center flex-nowrap">
                <h1 className="text-[1.1rem] mb-4 text-white">
                Welcome, {session?.user?.name}
                </h1>
            </div>
        </div>
      </div>
    </>
    )
  }
  