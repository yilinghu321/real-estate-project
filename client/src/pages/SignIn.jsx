import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from "../redux/user/userSlice.js";
import OAuth from "../components/OAuth.jsx";

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user);
  console.log(loading)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch('/api/auth/signin', 
      {
        method: 'POST',
        headers:  {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      } 
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure);
    }
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col mx-auto gap-4 w-1/2 md:w-96'>
        <input type="text" 
          placeholder='email' 
          className='border p-3 rounded-lg' 
          id='email' onChange={handleChange}
        />
        <input 
          type="text" 
          placeholder='password' 
          className='border p-3 rounded-lg' 
          id='password' 
          onChange={handleChange}
        />
        <button disabled={loading} className='bg-slate-700 text-gray-100 p-3 rounded-md uppercase hover:opacity-90 disabled::opacity-70'> 
          {loading? 'Loading...' : 'Sign In' } 
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-3 mx-auto w-1/2 md:w-96 mt-4'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mx-auto w-1/2 md:w-96 mt-5">{ error }</p> }
    </div>
  )
}
 