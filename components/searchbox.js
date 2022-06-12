import Image from "next/image";


const SearchBox = (props) => {
    return (
        <div className="relative text-gray-600 ">
           <input className="border-2 border-gray-300 bg-white h-10 px-5 pr-0 lg:pr-16 rounded-lg text-sm focus:outline-none"
             type="search" name="search" placeholder="Search"/>
           <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
                    <div className="text-gray-600 h-4 w-4 fill-current">
                        <Image
                            src="/static/images/search.svg"
                            alt="search"
                            width="512px"
                            height="512px"
                        />
                    </div>
           </button>
         </div>

    )
}

export default SearchBox;