import { useState, useEffect } from "react";
import { GET_TOURS } from "./constants";
// import { useSelector } from "react-redux";
import axios from "axios";

const useTours = () =>{
    const [tours, setTours] = useState([]);
    // const token = useSelector(store => store.tour?.token);
  const token = document.cookie.split('_secure_RK_=')[1];

    useEffect(() =>{
        getTours();
    },[]);

    async function getTours(){
     if(token){
        const res = await axios.get(GET_TOURS,{
            headers:{
                Authorization: 'Bearer ' + token
            }
        });
        // const json = await res.json();
        console.log('json', res);
        setTours(res?.data?.data);
        console.log('tours',tours);
     }
    }
    return { tours };
}

export default useTours;