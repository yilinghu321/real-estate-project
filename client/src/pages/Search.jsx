import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard.jsx";

export default function Search() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: 0,
    pet: false,
    furnished: false,
    bedroom: 0,
    bathroom: 0,
    offer: false,
    sort: 'updatedAt',
    order: -1,
  });

  const navigate = useNavigate();
  console.log(listings.length)
  // console.log(sidebarData)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const offerFromUrl = urlParams.get('offer');
    const furnishedFromUrl = urlParams.get('furnished');
    const petFromUrl = urlParams.get('pet');
    const bedroomFromUrl = urlParams.get('bedroom');
    const bathroomFromUrl = urlParams.get('bathroom');
    const parkingFromUrl = urlParams.get('parking');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');
    if (searchTermFromUrl || typeFromUrl || offerFromUrl || furnishedFromUrl
      || petFromUrl || bedroomFromUrl || bathroomFromUrl || parkingFromUrl
      || sortFromUrl || orderFromUrl) 
    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      parking: parkingFromUrl? parseInt(parkingFromUrl) : 0,
      pet: petFromUrl === 'true'? true : false,
      furnished: furnishedFromUrl === 'true'? true : false,
      bedroom: bedroomFromUrl? parseInt(bedroomFromUrl) : 0,
      bathroom: bathroomFromUrl? parseInt(bathroomFromUrl) : 0,
      offer: offerFromUrl === 'true'? true : false,
      sort: sortFromUrl || 'updatedAt',
      order: orderFromUrl? parseInt(orderFromUrl) : -1,
    });

    const fetchListings = async () => {
      try {
        setShowMore(false);
        setLoading(true);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings/search?${searchQuery}`)
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
        }
        setListings(data);
        setLoading(false);
        if (data.length > 8) setShowMore(true);
      } catch (error) {
        setError(error.message)
        setLoading(false);
      }
    };
    fetchListings();
  },[location.search])

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('type', sidebarData.type);
    urlParams.set('offer', sidebarData.offer);
    urlParams.set('furnished', sidebarData.furnished);
    urlParams.set('pet', sidebarData.pet);
    urlParams.set('bedroom', sidebarData.bedroom);
    urlParams.set('bathroom', sidebarData.bathroom);
    urlParams.set('parking', sidebarData.parking);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('order', sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  
  const handleFormChange = (e) => {
    if (e.target.id === "searchTerm") setSidebarData({...sidebarData, searchTerm: e.target.value})
    if (e.target.id === 'rent' || e.target.id === 'sale' || e.target.id === 'all') setSidebarData({...sidebarData, type : e.target.id});
    if (e.target.id === 'furnished' || e.target.id === 'offer' || e.target.id === 'pet') setSidebarData({...sidebarData, [e.target.id] : e.target.checked || e.target.checked === 'true'? true : false});
    if (e.target.id === 'bathroom' || e.target.id === 'bedroom' || e.target.id === 'parking' || e.target.id === 'regularprice' || e.target.id === 'discountprice') setSidebarData({...sidebarData, [e.target.id] : e.target.value});
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split('_')[0] || 'updatedAt';
      const order = e.target.value.split('_')[1] === 'desc'? -1 : 1;
      setSidebarData({...sidebarData, sort, order});
    }
  }

  const handleShowMore = async () => {
    const urlParams = new URLSearchParams(location.search);
    const startIndex = listings.length;
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listings/search?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) setShowMore(false);
    setListings([...listings, ...data])
  }

  return (
    <div className='flex flex-col md:flex-row gap-6'>
      <div id='searchside' className='md:w-1/2 lg:w-1/3 p-7 border-b-2 md:border-b-0 md:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
          <div className="flex gap-1 items-center">
            <label className="font-semibold">Search:</label>
            <input onChange={handleFormChange} value={sidebarData.searchTerm} type="text" placeholder='Search...' id='searchTerm' className='border w-full bg-white rounded-lg p-2'/>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.type === 'all'} className='w-5' type="checkbox" id="all"/>
              <span>Rent & Sale</span> 
            </div>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.type === 'rent'}className='w-5' type="checkbox" id="rent"/>
              <span>Rent</span> 
            </div>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.type === 'sale'}className='w-5' type="checkbox" id="sale"/>
              <span>Sale</span> 
            </div>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.offer}className='w-5' type="checkbox" id="offer"/>
              <span>Offer</span> 
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.furnished}className='w-5' type="checkbox" name="type" id="furnished"/>
              <span>Furnished</span> 
            </div>
            <div className="flex gap-2">
              <input onChange={handleFormChange} checked={sidebarData.pet}className='w-5' type="checkbox" name="type" id="pet"/>
              <span>Pets</span> 
            </div>
          </div>
          <div className='flex flex-wrap gap-2 items-center'>
            <label className="font-semibold">Options:</label>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border border-gray-300 rounded-lg p-1' id='bedroom' min='0' max='10' onChange={handleFormChange} value={sidebarData.bedroom}/>
              <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border  border-gray-300 rounded-lg p-1' id='bathroom'min='0' max='10' onChange={handleFormChange} value={sidebarData.bathroom}/>
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-10 border border-gray-300 rounded-lg p-1' id='parking' onChange={handleFormChange} value={sidebarData.parking}/>
              <span>Parking</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="font-semibold">Sort:</label>
            <select onChange={handleFormChange} defaultValue='updatedAt_desc' className="border rounded-lg p-2" id="sort_order">
              <option value="regularprice_desc">Price high to low</option>
              <option value="regularprice_asc">Price low to high</option>
              <option value="updatedAt_desc">Latest</option>
              <option value="updatedAt_asc">Oldest</option>
            </select>
          </div>
          <button className="w-full bg-slate-700 text-white p-3 rounded-lg hover:opacity-85">Search</button>
        </form>
      </div>
      <div id='dislayside' className="p-6 flex-1">
        <h1 className="text-xl md:text-2xl font-semibold min-w-screen p-1 border-b text-slate-700">Listing Results:</h1>
        <div className="p-6 text-lg md:text-xl font-semibold text-slate-500">
          {loading && <label>Loading...</label>}
          {!loading && listings.length === 0 &&
          <label>No Listing Matches.</label>}
        </div>
        <div className='flex flex-col gap-8'>
          {!loading && listings.length !== 0 && listings.map((listing) =>
            <ListingCard key={listing._id} listing={listing}/>)
          }
        </div>
        {showMore && <p onClick={handleShowMore} className="text-green-900 text-sm uppercase underline hover:opacity-70 cursor-pointer p-7 text-center">Show more</p>}
      </div>
    </div>
  )
}
