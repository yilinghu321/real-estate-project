import { useEffect, useState } from "react"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from "../firebase";

export default function CreateListing() {

  const [isOffer, setIsOffer] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({imageUrls: []});
  const [uploading, setUploading] = useState(false);
  //console.log(formData)

  //console.log(files)
  //console.log(files.length)

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
            <input onChange={handleOnChange} className='border border-gray-500 rounded-lg p-3 w-full'type="file" id='images' accept="image/*" multiple/>
            <button disabled={uploading} type='button' onClick={(e) => handleImageSubmit(e)} className="border border-green-700 text-green-700 uppercase rounded-lg p-3 hover:shadow-md disabled:opacity-70">{uploading? 'Uploading' : 'Upload'}</button>
          </div>
          {
            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
              <div key={url} className="flex gap-4 justify-between items-center border p-3 rounded-lg">
                <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg hover:opacity-80  cursor-pointer"/>
                <button onClick={() => handleRemoveImage(index)} type='button' className="hover:opacity-60 rounded-lg p-2 text-red-700 uppercase">Delete</button>
              </div>
              
            ))
          }
          <button className="bg-slate-700 uppercase rounded-lg p-3 text-white hover:opacity-90 disabled:opacity-70">Create Listing</button>
          {imageUploadError && <p className="text-red-500">{imageUploadError}</p> }
        </div> 
      </form> 
    </main>
  )
}
