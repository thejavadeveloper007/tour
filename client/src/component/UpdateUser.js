import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GET_USER } from '../utils/constants';
import Simmer from './Simmer';

const UpdateUser = () => {
    // const userId = useSelector(store => store.tour?.userId);
    // console.log(localStorage.getItem('id'));
    // console.log('user',userId);
    // const token = useSelector(store => store.)
    const [userFormData, setUserFormData] = useState({
        name: "",
        email: "",
        photo: ""
      });
    useEffect(()=>{
        console.log('enter-----------');
        getMe(); 
    },[]);
   async function getMe(){
    const token = getTokenFromCookie();
        const response = await axios.get(`${GET_USER}/getUserById`,{
            headers:{
                Authorization: 'Bearer ' + token
            }
        });
        if(response){
            setUserFormData(response?.data?.data);
        }
    }
    function getTokenFromCookie() {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === '_secure_RK') {
            return value;
          }
        }
        return null; // Token not found
      }

      const handleInputChange =() =>{

      }

      const handleUpdateProfile =() => {

      }

  return userFormData.length === 0 ? <Simmer /> : (
    <div>
        <div>UpdateUser</div>
        <form
      className="flex flex-col items-center my-2 gap-2"
      onSubmit={handleUpdateProfile}
    >
      <div>
        <label className="mx-1" htmlFor="username">
          Username:
        </label>
        <input
          className="border border-gray-500 rounded-full w-full p-1 px-4"
          type="text"
          name="name"
          value={userFormData.name}
          onChange={ handleInputChange}
          required
        />
      </div>
      <div>
        <label className="mx-1" htmlFor="username">
          Email:
        </label>
        <input
          className="border border-gray-500 rounded-full w-full p-1 px-4"
          type="email"
          name="email"
          value={userFormData.email}
          onChange={ handleInputChange}
          required
        />
      </div>
      <div>
        <img src="file:///C:\Users\Rakesh Seervi\Downloads\IMG_20221217_004014.jpg" alt="xrf"/>
      </div>
      <button
        className="bg-teal-700 rounded-md mx-auto px-5 py-1 text-white"
        type="submit"
      >
        Save
      </button>
    </form>
    </div>
  )
  }
export default UpdateUser