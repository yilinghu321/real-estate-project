import { Link } from "react-router-dom"

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col mx-auto gap-4 w-1/2 md:w-96'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' ide='username'/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg' ide='email'/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg' ide='password'/>
        <button className='bg-slate-700 text-gray-100 p-3 rounded-md uppercase hover:opacity-90 disabled::opacity-70'>Sign Up</button>
      </form>
      <div className='flex gap-3 mx-auto w-1/2 md:w-96 mt-4'>
        <p>Have an account?</p>
        <Link to='/sign-in'>
          <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
    </div>
  )
}
