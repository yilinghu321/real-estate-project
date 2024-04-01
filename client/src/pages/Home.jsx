import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules';
import ListingCard from '../components/ListingCard';

export default function Home() {

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(rentListings)

  SwiperCore.use([Navigation]);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch('/api/listings/search?offer=true&sort=updatedAt&order=-1&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchSale();
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchSale = async () => {
      try {
        const res = await fetch('/api/listings/search?type=sale&sort=updatedAt&order=-1&limit=4');
        const data = await res.json();
        setSaleListings(data);
        fetchRent();
      } catch (error) {
        console.log(error.message)
      }
    }
    const fetchRent = async () => { 
      try {
        const res = await fetch('/api/listings/search?type=rent&sort=updatedAt&order=-1&limit=4');
        const data = await res.json();
        setRentListings(data);
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchOffers();
  },[])
  return (
    <div className='bg-gray-100'>
      <div className='p-12 sm:p-15 md:p-20 lg:p-24  flex flex-col max-w-6xl mx-auto'>
        <h1 className='text-4xl md:text-5xl lg:text-6xl text-slate-1000 font-bold'>ReEstate:</h1>
        <div className='mt-3 flex flex-col '>
          <h1 className='text-2xl md:text-3xl lg:text-4xl text-slate-500 font-bold leading-5 sm:leading-6 md:leading-7 lg:leading-8'>Unlock the Door to <br />Your <span className= 'font-bold text-slate-700'>Dream Home</span> </h1>
        </div>
        <div className='mt-6 text-xs text-gray-500'>
          ReEstate offers a seamless platform for all your property transactions. 
          <br />
          With comprehensive listings and expert support, we make buying, selling, or renting easy. 
        </div>
        <Link to='/search' className='text-xs mt-6 text-blue-900 font-bold hover:underline'> Let's Start Now...</Link>
      </div>
      <div>
        <Swiper navigation>
          {offerListings && offerListings.length > 0 && offerListings.map((listing) => <SwiperSlide key={listing._id}>
            <div className='h-[280px] sm:h-[360px] md:h-[420px] lg:h-[500px]'style={{background:`url("${listing.imageUrls[0]}")center`, backgroundSize:"cover"}}></div>
          </SwiperSlide>)} 
        </Swiper>
      </div>
      <div className='p-10 px-12 sm:px-15 md:px-20 lg:px-24 max-w-6xl mx-auto flex flex-col gap-8'>
        {offerListings && offerListings.length > 0 && (
        <div>
          <div className='flex flex-col'>
            <h2 className='text-slate-700 font-semibold sm:text-xl lg:text-2xl'>Recent offers</h2>
            <Link className='text-xs text-blue-900 hover:underline' to='/search?offer=true'>Show more offers</Link>
            <div className='flex flex-wrap gap-4 my-3'>
              {offerListings.map((listing) => (<ListingCard key={listing._id} listing={listing}/>))}
            </div> 
          </div>
        </div>
        )} 
        {rentListings && rentListings.length > 0 && (
        <div>
          <div className='flex flex-col'>
            <h2 className='text-slate-700 font-semibold sm:text-xl lg:text-2xl'>Recent Rentals::</h2>
            <Link className='text-xs text-blue-900 hover:underline' to='/search?type=rent'>Show more rentals</Link>
            <div className='flex flex-wrap gap-4 my-3'>
              {rentListings.map((listing) => (<ListingCard key={listing._id} listing={listing}/>))}
            </div> 
          </div>
        </div>
        )}
        {saleListings && saleListings.length > 0 && (
        <div>
          <div className='flex flex-col'>
            <h2 className='text-slate-700 font-semibold sm:text-xl lg:text-2xl'>Recent Sales:</h2>
            <Link className='text-xs text-blue-900 hover:underline' to='/search?type=sale'>Show more sales</Link>
            <div className='flex flex-wrap gap-4 my-3'>
              {saleListings.map((listing) => (<ListingCard key={listing._id} listing={listing}/>))}
            </div> 
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
