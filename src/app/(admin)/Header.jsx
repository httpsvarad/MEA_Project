import Link from "next/link";

export default function Headers() {
    return (
    <>
      {/* <div className="w-[100%] h-[8vh] bg-white shadow-md flex items-center justify-between px-5"> */}
        <div>
            <ul className="flex items-center gap-3 flex-col">
                <Link href="/Admin" className=" cursor-pointer">Home</Link>
                <Link href="/Admin/Members" className=" cursor-pointer">Members</Link>
                <Link href="/Admin/member_req" className=" cursor-pointer">Members Request</Link>
                <Link href={'/Admin/replies'} className=" cursor-pointer">Replies</Link>
                <Link href={'/Admin/Events'} className=" cursor-pointer">Events</Link>
                <Link href={'/Admin/gallery'} className=" cursor-pointer">Gallery</Link>
            </ul>
        {/* </div> */}
      </div>
    </>
    )
  }
  