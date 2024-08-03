export default function Headers() {
    return (
    <>
      <div className="w-[100%] h-[8vh] bg-white shadow-md flex items-center justify-between px-5">
        <div><h1 className="text-[1.5rem]">Admin Panel</h1></div> 
        <div>
            <ul className="flex items-center gap-3">
                <li className=" cursor-pointer">Home</li>
                <li className=" cursor-pointer">Members</li>
                <li className=" cursor-pointer">Gallery</li>
                <li className=" cursor-pointer">Events</li>
            </ul>
        </div>
      </div>
    </>
    )
  }
  