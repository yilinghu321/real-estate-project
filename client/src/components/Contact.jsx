import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Contact({listing}) {
  const [landlord, setLandlord] = useState(null); 
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setError(null);
        const res = await fetch(`/api/user/contact/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
        }
        setLandlord(data);
      } catch (error) {
        setError(error.message);
      }
    }
    fetchLandlord();
    console.log(landlord)
  },[listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  return (
    <div>
      {landlord && (
      <div className="flex flex-col gap-3">
        <p>Contact {' '} 
          <span className="font-semibold text-green-900 underline">{landlord.username}</span>
          <span> {' '}for {' '}</span>
          <span className="font-semibold text-red-900 underline">{listing.name.toLowerCase()}</span>
        </p>
        <textarea className='border rounded-lg border-slate-500 w-full p-3' onChange={(e) => setMessage(e.target.value)} name="message" id="message" rows="5"></textarea>
        <Link to={`mailto:${landlord.email}?subject=Regarding the ${listing.name}&body=${message}`} className="bg-slate-700 rounded-lg p-3 uppercase hover:opacity-85 text-white text-center">
        Send Messages
        </Link>
      </div>
      )}
    </div>
  )
}
