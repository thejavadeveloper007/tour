import React, { useState } from 'react'
import axios from 'axios';
// import { addLoginStatus } from '../utils/tourSlice';
// import { useDispatch } from 'react-redux';
import GoogleOauth from './GoogleOauth';
import { toast } from 'react-toastify';

const Login = () => {
  // let dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email:'',
    password:''
  });
  // const [password, setPassword] = useState("dummyPass");
  // const [password, setPassword] = useState(null);
  // const googleAuth =() =>{
  //   // console.log('g auth', process.env.SERVER_URL);
  //   window.open(
  //     `http://localhost:7007/auth/google/callback`,
  //     "_self"
  //   );
  // };

  const handleLogin = async(event) => {
    event.preventDefault();
    // Perform login logic here
    console.log('Logged in with username:', formData);
    axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/user/login`,JSON.stringify(formData),{  headers:{
      'Content-Type': 'application/json'
    }}
    ).then((response) =>{

      console.log('29',response); 
      localStorage.setItem('id', response.data.id);
                  const d = new Date();
                  d.setTime(d.getTime() + (30*24*60*60*1000));
                  let expires = "expires="+ d.toUTCString();
                  document.cookie = "_secure_RK_" + "=" + response.data.token + ";" + expires + ";path=/";
                  window.location.href = ('/');
    }).catch((err) =>{   
      toast.error('Login failed. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }) 
      
   
  };

  // const handleUsername = (event) =>{
  //   setEmail(event.target.value);
  // }

  // const handlePassword = (event) =>{
  //   setPassword(event.target.value);
  // }

  const handleInputChange =(event) =>{
    const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value
      });
  }

  return (
    <div className='flex flex-col items-center mx-auto gap-3 py-4 h-81.6 w-64'>
      <div className='flex flex-col items-center gap-2'>
        <h1 className='font-bold text-2xl'>Login Page</h1>
        <form className='flex flex-col items-start gap-2' onSubmit={handleLogin}>
          <div>
          <label className='mx-1' htmlFor="username">Email:</label>
            <input className='w-full form-input rounded-full h-8' type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder='Enter email here...'/>
          </div>
          <div className='my-1'>
            <label className='mr-3' htmlFor="password">Password:</label>
            <input className='w-full form-input rounded-full h-8  ' type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder='Enter password here...'/>
          </div>
          <div className='flex content-center mx-auto'>
          <button className='bg-teal-600 hover:bg-teal-700 rounded-md px-5 py-1 text-white' type='submit'>Login</button>
          </div>
        </form>
      </div>
      <div className='flex flex-col items-center gap-3'>
        <p className='font-bold'>or</p>
       <button>
        <div className='mx-auto'>
       <GoogleOauth />
       </div>
       </button>
      </div>
    </div>
  )
}

export default Login