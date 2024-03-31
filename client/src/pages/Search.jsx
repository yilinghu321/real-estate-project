import { useState } from "react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFormChange = (e) => {

  }

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div id='searchside' className='md:w-1/2 lg:w-1/3 p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen'>
        <form className="flex flex-col gap-6 text-sm">
          <div className="flex gap-1 items-center">
            <label className="font-semibold">Search:</label>
            <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search...' className='border w-full bg-white rounded-lg p-2'/>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="all"/>
              <span>Rent & Sale</span> 
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="rent"/>
              <span>Rent</span> 
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="sale"/>
              <span>Sale</span> 
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" id="offer"/>
              <span>Offer</span> 
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" name="type" id="furnished"/>
              <span>Furnished</span> 
            </div>
            <div className="flex gap-2">
              <input className='w-5' type="checkbox" name="type" id="pet"/>
              <span>Pets</span> 
            </div>
          </div>
          <div className='flex flex-wrap gap-2 items-center'>
            <label className="font-semibold">Options:</label>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border border-gray-300 rounded-lg p-1' id='bedroom' min='1' max='10' onChange={handleFormChange}/>
              <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border  border-gray-300 rounded-lg p-1' id='bathroom' onChange={handleFormChange} />
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border border-gray-300 rounded-lg p-1' id='parking' onChange={handleFormChange}/>
              <span>Parking</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select className="border w-1/2 rounded-lg p-2" id="sort_order">
              <option value="">Price high to low</option>
              <option value="">Price low to high</option>
              <option value="">Latest</option>
              <option value="">Oldest</option>
            </select>
          </div>
          <button className="w-full bg-slate-700 text-white p-3 rounded-lg hover:opacity-85">Search</button>
        </form>
      </div>
      <div id='dislayside'>
        <h1 className="text-xl md:text-2xl font-semibold border-b p-3 text-slate-700 mt-3">Listing Results:</h1>
      </div>
    </div>
  )
}
