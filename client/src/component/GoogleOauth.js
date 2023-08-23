import React from 'react';
import { GoogleOAuthProvider ,GoogleLogin} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import ReactGA from 'react-ga';
import axios from 'axios';
import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { addToken } from '../utils/tourSlice';

const baseURL = process.env.REACT_APP_SERVER_URL;
const GoogleOauth = () => {
    // let dispatch = useDispatch();
    useEffect(()=> {
        ReactGA.pageview(window.location.pathname);
    })

      const responseMessage = async(response) => {
        console.log('response 15',response);
          const data = await jwt_decode(response.credential);
          console.log('data 17',data);
          if(data.email_verified) {
              localStorage.setItem('name', data.given_name + " " + data.family_name);
              localStorage.setItem('email', data.email);
  
              axios.post(`${baseURL}/api/v1/user/google-login`, { data: data }).then(async(response) => {
                console.log('response 23',response);
                localStorage.setItem('id', response.data.id);
                const d = new Date();
                d.setTime(d.getTime() + (30*24*60*60*1000));
                let expires = "expires="+ d.toUTCString();
                document.cookie = "_secure_RK_" + "=" + response.data.token + ";" + expires + ";path=/";
  
                ReactGA.event({
                  category: "/google-login",
                  action: "Google login",
                  label: "Google",
                  value: 'data'
                })
            //    await dispatch(addToken(response.data.token)); //temporary adding token to redux store
                window.location.href = ('/');
  
                // if(response.data.message.comment === "Old User") {
                //   window.location.href = ('/sectionpage');
                // }
                // else {
                //   window.location.href = ('/uploadpage');
                // }
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

export default GoogleOauth