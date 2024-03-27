import { useState } from "react"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {

  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address:'',
    regularprice: 0,
    discountprice: 0,
    bathroom: 1,
    bedroom: 1,
    furnished: false,
    parking: 0,
    type: 'rent',
    pet: false,
    offer: false,
    userRef: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitFormError, setSubmitFormError] = useState(null);
  const [submitFormSuccess, setSubmitFormSuccess] = useState(false);
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  console.log(formData)
  const handleOnChange = (e) => {
    setImageUploadError(null);
    if (e.target.files.length > 6) {
      const value = Object.values(e.target.files).slice(0, 6);
      setFiles(value);
      setImageUploadError("Can select only upto 6 images, the rest images won't be sent.");
    } else setFiles(e.target.files);
    console.log(e.target.files)
  };

  const handleImageSubmit = (e) => {
    setUploading(false);
    
    if (files.length === 0) {
      console.log(files.length)
      setImageUploadError('No image has been selected!');
      return;
    }
    if (files.length + formData.imageUrls.length > 6) {
      setImageUploadError('Exceed maximum of 6 images (2 MB Each)!');
      return;
    }
    setImageUploadError(null);
    setUploading(true);

    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }
    Promise.all(promises).then((urls) => {
      setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
      setImageUploadError(null);
      setUploading(false);
    }).catch((err) => {
      setImageUploadError('Image upload failed (2 MB Max Each)!');
      setUploading(false);
    });
  }

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',  
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (downloadURL) => { resolve(downloadURL);
          });
      })
    })
  }

  const handleRemoveImage = (index) => { 
     setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
     })
  }

  const handleFormChange = (e) => {
    if (e.target.id === 'rent' || e.target.id === 'sale') setFormData({...formData, type : e.target.id});
    if (e.target.id === 'name' || e.target.id === 'description' || e.target.id === 'address') setFormData({...formData, [e.target.id] : e.target.value});
    if (e.target.id === 'furnished' || e.target.id === 'offer' || e.target.id === 'pet') setFormData({...formData, [e.target.id] : e.target.checked});
    if (e.target.id === 'bathroom' || e.target.id === 'bedroom' || e.target.id === 'parking' || e.target.id === 'regularprice' || e.target.id === 'discountprice') setFormData({...formData, [e.target.id] : e.target.value});
  }

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setSubmitFormError('You must upload at least 1 image.');
      if (+formData.regularprice < +formData.discountprice) return setSubmitFormError('Discount price must be lower than regular price.');

      setSubmitFormLoading(true);
      setSubmitFormError(null);
      setSubmitFormSuccess(false);

      const res = await fetch('/api/listing/create', 
      {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id})
      })
      const data = await res.json();
      if (data.success === false) {
        setSubmitFormError(data.message);
        setSubmitFormSuccess(false);
        return;
      } 
      setSubmitFormSuccess(true);
      setSubmitFormLoading(false);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setSubmitFormError(error.message);
      setSubmitFormSuccess(false);
    }
  }

  return ( 
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
      <form onSubmit={handleCreateList} className='flex flex-col sm:flex-row gap-6'>
        <div className='flex flex-col gap-4 flex-1'>
          <input type="text" placeholder='Name' className='border border-gray-300 p-3 rounded-lg' id='name' maxLength='62' minLength='10' onChange={handleFormChange} value={formData.name} required/>
          <textarea type="text" placeholder='Description' className='border border-gray-300 p-3 rounded-lg' id='description' onChange={handleFormChange} value={formData.description} required/>
          <input type="text" placeholder='Address' className='border border-gray-300 p-3 rounded-lg' id='address' onChange={handleFormChange} value={formData.address} required/>
          <div className='flex gap-6 mt-3 mb-3'>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='sale' onChange={handleFormChange} checked={formData.type === 'sale'}/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='rent' onChange={handleFormChange} checked={formData.type === 'rent'}/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='furnished' onChange={handleFormChange} checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className='w-5' id='offer' onChange={handleFormChange} checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border border-gray-300 rounded-lg p-3' id='bedroom' min='1' max='10' onChange={handleFormChange} value={formData.bedroom} required/>
              <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border  border-gray-300 rounded-lg p-3' id='bathroom' onChange={handleFormChange} value={formData.bathroom} required />
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-20 border border-gray-300 rounded-lg p-3' id='parking' onChange={handleFormChange} value={formData.parking} required/>
              <span>Parking lot</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className='flex gap-2 items-center'>
              <input type="number" className='w-24 border border-gray-300 rounded-lg p-3' id='regularprice' min='0' max='100000' onChange={handleFormChange} value={formData.regularprice} required/>
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                {(formData.type  === 'rent') &&<span className="text-xs">($ / Month)</span>}
              </div>
            </div>
            { formData.offer && <div className='flex gap-2 items-center'>
              <input type="number" className='w-24 border  border-gray-300 rounded-lg p-3' id='discountprice' min='0' max='100000' onChange={handleFormChange} value={formData.discountprice}/>
              <div className="flex flex-col items-center">
                <span>Discount Price</span>
                {(formData.type  === 'rent') && <span className="text-xs"> ($ / Month)</span>}
              </div>
            </div> }
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Images:
            <span className="text-gray-700 font-normal ml-2"> The first image will be the cover(Max 6/ 2 MB Each)</span>
          </p>
          <div className="flex gap-3"> 
            <input onChange={handleOnChange} className='border border-gray-500 rounded-lg p-3 w-full'type="file" id='images' accept="image/*" multiple/>
            <button disabled={uploading || submitFormLoading} type='button' onClick={handleImageSubmit} className="border border-green-700 text-green-700 uppercase rounded-lg p-3 hover:shadow-md disabled:opacity-70">{uploading? 'Uploading' : 'Upload'}</button>
          </div>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className="flex gap-4 justify-between items-center border p-3 rounded-lg">
                <img src={url} alt="listing ima ge" className="w-20 h-20 object-contain rounded-lg hover:opacity-80  cursor-pointer"/>
                <button onClick={() => handleRemoveImage(index)} type='button' className="hover:opacity-60 rounded-lg p-2 text-red-700 uppercase">Delete</button>
              </div>
              
            ))
          }
          <button disabled={submitFormLoading || uploading} onClick={handleCreateList} className="bg-slate-700 uppercase rounded-lg p-3 text-white hover:opacity-90 disabled:opacity-70">{ submitFormLoading? 'creating' : 'Create Listing'}</button>
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p>} 
          {submitFormError && <p className="text-red-500">{submitFormError}</p>}
        </div> 
      </form> 
    </main>
  )
}
