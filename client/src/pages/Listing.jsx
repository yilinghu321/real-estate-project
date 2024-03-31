import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaDog
} from 'react-icons/fa';
import { BsFillSignNoParkingFill } from "react-icons/bs";
import { IoBed } from "react-icons/io5";

//import Contact from '../components/Contact';

export default function Listing() {

  SwiperCore.use([Navigation]);

  const [listingData, setListingData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/listings/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        } 
        setListingData(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    }
    fetchListing();
  },[])

  return (
    <main>
      {loading && 
        <p className="text-center my-10 text-2xl font-semibold text-slate-500">Loading...</p>}
      {error && 
        <div className="flex flex-col my-10 gap-3">
          <p className="text-center text-2xl font-semibold text-slate-500">{error}Sorry!</p> 
          <p className="text-center text-2xl font-semibold text-slate-500"> There is something went wrong...</p>
        </div>}
      {!loading && !error && listingData && (
        <div>
          <Swiper navigation>
            {listingData.imageUrls.map((url) =>  (
              <SwiperSlide key={url}>
                <div className="h-[240px] sm:h-[500px]" style={{background: `url("${url}") no-repeat center`, backgroundSize: 'cover'}}></div>
              </SwiperSlide>
            ))}
            <div className="absolute top-[9%] right-[3%] h-10 w-100 z-10 justify-stretch flex gap-2 items-center">
              {copied && (
                <p className=' bg-slate-100 h-7 bg-opacity-75 rounded-md text-slate-900 text-xs p-1.5'>
                  Link copied!
                </p>
              )}
              <div className='border rounded-full w-10 h-10 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare
                  className='text-slate-500'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 2000);
                  }}
                />
              </div>
            </div> 
          </Swiper>
          
          <div className="flex flex-col gap-3 mx-auto max-w-4xl p-3"> 
            <p className="text-2xl font-semibold text-slate-700">{listingData.name} - ${' '} 
              {listingData.offer
                ? listingData.discountprice.toLocaleString('en-US') 
                : listingData.regularprice.toLocaleString('en-US')          
              }
              {listingData.type === 'rent' && ' / Month'}
            </p>
            <p className='flex items-center gap-2 text-slate-600  text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listingData.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center justify-center p-1 rounded-md'>
                {listingData.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listingData.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listingData.regularprice - +listingData.discountprice} OFF
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 mt-3">
              <span className="font-semibold text-black underline">Description</span>
              <p className="text-slate-700">{listingData.description}</p>
            </div>
            <ul className="text-sm font-semibold text-green-900 flex gap-4 sm:gap-6 flex-wrap">
                <li className="items-center flex gap-1 whitespace-nowrap">
                  <IoBed className="text-2xl"/>
                  {listingData.bedroom > 1? `${listingData.bedroom} Beds` : `${listingData.bedroom} Bed`}
                </li>
                <li className="items-center flex gap-1 whitespace-nowrap">
                  <FaBath className="text-xl"/>
                  {listingData.bathroom > 1? `${listingData.bathroom} Baths` : `${listingData.bathroom} Bath`}
                </li>
                {listingData.parking < 1
                  ? <li className="items-center flex gap-1 whitespace-nowrap"> 
                  <FaParking className="text-xl"/>{listingData.parking} Parking 
                  </li>
                  : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
                  <BsFillSignNoParkingFill className="text-xl"/>No Parking
                  </li>}
                {listingData.furnished
                  ? <li className="items-center flex gap-1 whitespace-nowrap">
                  <FaChair className="text-xl"/>Furnished
                  </li>
                  : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
                  <FaChair className="text-xl"/>No Furniture
                  </li>}
                {listingData.pet
                ? <li className="items-center flex gap-1 whitespace-nowrap">
                <FaDog className="text-2xl"/>Pets Friendly
                </li>
                : <li className="items-center flex gap-1 whitespace-nowrap text-red-900"> 
                <FaDog className="text-2xl"/>No Pets
                </li>}
            </ul> 
          </div>
        </div>
      )}
    </main> 
  )
}
