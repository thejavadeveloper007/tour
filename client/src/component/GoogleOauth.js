import React from 'react';
import { GoogleOAuthProvider ,GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import ReactGA from 'react-ga';
import axios from 'axios';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { addLoginStatus } from '../utils/tourSlice';
// import { addToken } from '../utils/tourSlice';

const baseURL = process.env.REACT_APP_SERVER_URL;
const GoogleOauth = () => {
    let dispatch = useDispatch();
    useEffect(()=> {
        ReactGA.pageview(window.location.pathname);
    })

    // if(document.cookie.includes('_secure_RK_')){
    //   dispatch(addLoginStatus(true))
    // }

    const responseMessage = async(response) => {
      const data = await jwt_decode(response.credential);
      if(data.email_verified) {
        localStorage.setItem('name', data.given_name + " " + data.family_name);
        localStorage.setItem('email', data.email);
        
        axios.post(`${baseURL}/api/v1/user/google-login`, { data: data }).then(async(response) => {
          dispatch(addLoginStatus(true));
                localStorage.setItem('id', response.data.id);
                const d = new Date();
                d.setTime(d.getTime() + (30*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = `_secure_RK=${response.data.token};expires=${expires};path=/`;
  
                ReactGA.event({
                  category: "/google-login",
                  action: "Google login",
                  label: "Google",
                  value: 'data'
                })
            //    await dispatch(addToken(response.data.token)); //temporary adding token to redux store
            setTimeout(()=>{
              window.location.href = ('/');
            },1500)
            toast.success('Login successful!', {
              position: 'top-center',
              autoClose: 1500,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
            });
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
          }
        };
        const errorMessage = (error) => {
          console.log("Google Error", error);
        };
  return (
    <div className="G">
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="G1">
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
    </GoogleOAuthProvider>
  </div>
  )
}

export default GoogleOauth;