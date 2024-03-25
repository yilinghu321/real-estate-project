import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux';
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js';

export default function Profile() {

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [userUploadSuccess, setUserUploadSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(file);
  console.log(uploadPercentage);
  console.log(formData);
  console.log(fileUploadError);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    setFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
 
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadPercentage(Math.round(progress));
    },
    (error) => {
      setFileUploadError(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadURL) => setFormData({...formData, photo: downloadURL})
      )
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value, 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, 
      {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      } 
      dispatch(updateUserSuccess(data));
      setUserUploadSuccess(true);
      navigate('/profile')
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold m-4 mt-6'>Profile</h1>
      <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
      <img onClick={() => fileRef.current.click()} className="rounded-full mx-auto h-24 w-24 mt-6 cursor-pointer" src={formData.photo || currentUser.photo} alt="profile" />
      <p className="self-center mt-3 mx-auto">
        {fileUploadError? 
          <span className="text-center text-red-500"> Failed! Error Occurs.</span> : 
          (uploadPercentage > 0 && uploadPercentage < 100)? 
            <span className="text-slate-500">{`Uploading ${uploadPercentage}%`}</span> :
              (uploadPercentage === 100)? 
                <span className="text-center text-green-500">Profile image successfully uploaded!</span> : ""}
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col mt-4 gap-4'>
        <input type="text" 
          placeholder='username' 
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg' 
          id='username' onChange={handleChange}
        />
        <input type="text" 
          placeholder='email' 
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg' 
          id='email' onChange={handleChange}
        />
        <input 
          type="password" 
          placeholder='password' 
          className='border p-3 rounded-lg' 
          id='password' 
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-gray-100 p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-70'> 
          {loading? 'Uploading...' : 'Update' } 
        </button>
      </form>
      <Link to='/'>
        <button className='bg-green-700 text-gray-100 p-3 rounded-md uppercase hover:opacity-90 disabled:opacity-70 max-w-lg mx-auto mt-4'>Create the listing</button>
      </Link>
      <div className='flex gap-3 justify-between mx-auto mt-4 text-red-500'>
        <span className="cursor-pointer">Delete account?</span>
        <Link to='/sign-in'>
          <span className="cursor-pointer">Sign out</span>
        </Link>
      </div>
      <p className="self-center mt-3">
        {error? 
          <span className="text-red-500"> {error}</span> : 
          userUploadSuccess? <span className="text-green-500">User is successfully updated!</span> : ''}
      </p>
    </div>
  )
}
