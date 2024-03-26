import { useState } from "react"

export default function CreateListing() {
  const [ isOffer, setIsOffer] = useState(false);
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" placeholder='Name' className='border border-gray-300 p-3 rounded-lg' id='name' maxLength='62' minLength='10' required/>
          <textarea type="text" placeholder='Description' className='border border-gray-300 p-3 rounded-lg' id='description' required/>
          <input type="text" placeholder='Address' className='border border-gray-300 p-3 rounded-lg' id='address' required/>
          <div className='flex gap-6 mt-3 mb-3'>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='sale'/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='rent'/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='furnished'/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input onClick={() => setIsOffer(true)}type="checkbox" className='w-5' id='offer'/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border border-gray-300 rounded-lg p-3' id='bedroom' min='1' max='10' required/>
              <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border  border-gray-300 rounded-lg p-3' id='bathroom'/>
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border border-gray-300 rounded-lg p-3' id='parking'/>
              <span>Parking lot</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-24 border border-gray-300 rounded-lg p-3' id='regularprice' min='1' max='10000' required/>
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div>
            { isOffer && <div className='flex gap-2 items-center'>
              <input type="number" className='w-24 border  border-gray-300 rounded-lg p-3' id='discountprice' min='1' max='10000'/>
              <div className="flex flex-col items-center">
                <span>Discount Price</span>
                <span className="text-xs">($ / Month)</span>
              </div>
            </div> }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images:
            <span className="text-gray-700 font-normal ml-2"> The first image will be the cover(Max 6/ 2 MB Each)</span>
          </p>
          <div className="flex gap-3"> 
            <input className='border border-gray-500 rounded-lg p-3 w-full'type="file" id='images' accept="image/*" multiple/>
            <button className="border border-green-700 text-green-700 uppercase rounded-lg p-3 hover:shadow-md disabled:opacity-70">Upload</button>
          </div>
          <button className="bg-slate-700 uppercase rounded-lg p-3 text-white hover:opacity-90 disabled:opacity-70">Create Listing</button>
        </div>
      </form>
    </main>
  )
}
