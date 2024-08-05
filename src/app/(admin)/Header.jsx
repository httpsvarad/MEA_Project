import Link from "next/link";

export default function Headers() {
    return (
    <>
      {/* <div className="w-[100%] h-[8vh] bg-white shadow-md flex items-center justify-between px-5"> */}
        <div className="w-full ">
            <ul className="flex items-center  flex-col border-spacing-5 mt-2 ">
                <Link href="/Admin" className=" cursor-pointer text-white text-[0.9rem] border-y-[2px] xl:text-[1.2rem]  border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center ">Home</Link>
                <Link href="/Admin/Members" className=" cursor-pointer text-white text-[0.9rem] xl:text-[1.2rem]  border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center">Members</Link>
                <Link href="/Admin/member_req" className="  cursor-pointer text-white text-[0.9rem] xl:text-[1.2rem]  border-y-[2px] border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center">Members Request</Link>
                <Link href={'/Admin/replies'} className="  cursor-pointer text-white text-[0.9rem] xl:text-[1.2rem]  border-b-[2px] border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center">Replies</Link>
                <Link href={'/Admin/Events'} className=" cursor-pointer text-white text-[0.9rem]  xl:text-[1.2rem]  border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center">Events</Link>
                <Link href={'/Admin/gallery'} className="  cursor-pointer text-white text-[0.9rem] xl:text-[1.2rem] border-y-[2px] border-white h-[7vh] items-center
                 hover:bg-red-500 w-full flex justify-center">Gallery</Link>
            </ul>
        {/* </div> */}
      </div>
    </>
    )
  }
  