import { useState, useEffect } from "react";
import { GET_TOURS } from "./constants";
import axios from "axios";

const useTours = () =>{
    const [tours, setTours] = useState([]);

    useEffect(() =>{
        getTours();
    },[]);
    
    async function getTours(){
        const token = getTokenFromCookie();
     if(token){
        const res = await axios.get(GET_TOURS,{
            headers:{
                Authorization: 'Bearer ' + token
            }
        });
        setTours(res?.data?.data);
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
    return { tours };
}

export default useTours;