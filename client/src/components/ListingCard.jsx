import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaBath,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaDog
} from 'react-icons/fa';
import { BsFillSignNoParkingFill } from "react-icons/bs";
import { IoBed } from "react-icons/io5";

export default function ListingCard({listing}) {
  return (
    <div className=''>
      <Link className='w-full sm:w-[300px] shadow-md bg-white flex flex-col overflow-hidden rounded-lg' to={`/listings/${listing._id}`}>
         <img className='h-[320px] sm:h-[200px]  object-cover hover:scale-105 transition-scale duration-300'src={listing.imageUrls[0]} alt="listing_cover" />
         <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
          <p className='flex gap-1 items-center text-slate-600  text-xs'>
              <FaMapMarkerAlt className='text-green-700 ' />
              {listing.address}
          </p>
          <p className="text-slate-700 text-xs line-clamp-2">{listing.description}</p>
          <p className="text-sm font-semibold text-slate-500 mt-1 mb-2"> $
            {listing.offer
              ? listing.discountprice.toLocaleString('en-US') 
              : listing.regularprice.toLocaleString('en-US')          
            }
            {listing.type === 'rent' && ' / Month'}
          </p>
          <div className='flex items-center gap-2 text-xs text-green-900 font-bold'>
            <div className='justify-center flex gap-1 items-center'>
              <IoBed className="w-3.5 h-3.5"/>
              <p className=''> {listing.bedroom}</p>
            </div>
            <div className='justify-center flex gap-1 items-center'>
              <FaBath className="w-3.5 h-3.5"/>
              <p className=''> {listing.bathroom}</p>
            </div>
            <div>
            {listing.parking > 0
              ? <li className="items-center flex gap-1 whitespace-nowrap"> 
              <FaParking className="w-3.5 h-3.5"/>{listing.parking} 
              </li>
              : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
              <BsFillSignNoParkingFill className="ww-3.5 h-3.5"/>No
              </li>}
            </div>
            <div>
            {listing.furnished
              ? <li className="items-center flex gap-1 whitespace-nowrap">
              <FaChair className="w-3.5 h-3.5"/>Yes
              </li>
              : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
              <FaChair className="w-3.5 h-3.5"/>No
              </li>}
            </div>
            <div>
              {listing.pet
              ? <li className="items-center flex gap-1 whitespace-nowrap">
              <FaDog className="w-3.5 h-3.5"/>Yes
              </li>
              : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
              <FaDog className="w-3.5 h-3.5"/>No
              </li>}
            </div>
          </div>
        </div>
      </Link>
      
    </div>
  )
}
