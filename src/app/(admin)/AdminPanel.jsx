import Navbar from './Navbar' 
import Header from './Header'


export default function AdminPanel() {
  return (
    <>
    <div className="flex w-full h-screen flex-row">
    <Navbar />
      <div className='flex flex-col w-full gap-5 h-screen'>
        <div>
        <Header />
        </div>
        <div className='w-full flex justify-center items-center h-[100vh]'>
          <div className='w-[80%] flex flex-wrap justify-evenly items-center gap-5' >
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Member List</div>
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Gallery</div>
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Event</div>
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 tebg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Admin List</div>
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Event</div>
          <div className='w-[18rem] h-[30vh] rounded-md bg-blue-400 tebg-blue-400 text-white shadow-md flex justify-center items-center cursor-pointer'  >Admin List</div>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}
