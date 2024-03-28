import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {

  SwiperCore.use([Navigation]);

  const [listingData, setListingData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
              <div className="h-[500px]" style={{background: `url("${url}"
) no-repeat center`, backgroundSize: 'cover'}}></div>
            </SwiperSlide>
          ))}
      </Swiper>
      </div>
      )}
    </main> 
  )
}
