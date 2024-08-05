// import Image from "next/image"
// import IMGs from "../../Assets/IMGs/man.png"
import { useSession } from "next-auth/react";
import Headers from "./Header"


export default function NAV() {
  const { data: session } = useSession();
    return (
    <>
      <div className="w-[50%] md:w-[25%] gl:w-[19%] xl:w-[15%] xl:h-[100%] shadow-md bg-[#c72626] flex flex-col  xl:text-xl">
        <div className="w-full flex py-2 px-1 flex-col">
            {/* <div className=" w-full flex justify-center items-center">
                <Image 
                className="Admin w-full"
                src={IMGs}  
                alt="Admin" />
            </div> */}
            <div className="w-full flex items-center justify-center flex-nowrap">
                <h1 className="text-[0.9rem] xl:text-[1.2rem]  mb-4 text-white">
                Welcome, {session?.user.name}
                </h1>
            </div>
            <Headers/>
        </div>
      </div>
    </>
    )
  }
  