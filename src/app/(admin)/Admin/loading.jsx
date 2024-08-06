import Image from "next/image";

export default  function loading(){
    return(
        <div>
           <div className="h-screen bg-white">
            <div className="flex justify-center items-center h-full">
            <div class="w-12 h-12 border-2 border-red-600 rounded-full loader"></div>
            </div>
            </div>
        </div>
    );
}