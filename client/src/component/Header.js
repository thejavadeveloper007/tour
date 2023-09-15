import { Link } from "react-router-dom";
import { LOGO_URL } from "../utils/constants";
// import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { addLoginStatus } from "../utils/tourSlice";
import userImage from "../assets/images/user_profile_picture.png";

const Header = () => {
  const loginStatus = useSelector((store) => store.tour.loginStatus);
  const user = useSelector((store) => store.tour.user);
  const { photo } = user;
  // let dispatch = useDispatch();
  // // const [isProfile, setIsProfile] = useState(false);

  // useEffect(()=>{
  //   const token = getTokenFromCookie()

  //     if(token){
  //         console.log('login 17',loginStatus);
  //         dispatch(addLoginStatus(true))
  //         console.log('login 19',loginStatus);
  //     }else{
  //         dispatch(addLoginStatus(false))
  //     }
  // },[]);
  // function getTokenFromCookie() {
  //     const cookies = document.cookie.split(';');
  //     for (const cookie of cookies) {
  //       const [name, value] = cookie.trim().split('=');
  //       if (name === '_secure_RK') {
  //         return value;
  //       }
  //     }
  //     return null; // Token not found
  //   }
  return (
    <div className="flex justify-between p-2 bg-emerald-500 shadow-md items-center">
      <div>
        <img
          className="w-14 bg-transparent box-content rounded-full"
          src={LOGO_URL}
          alt="logo"
        />
      </div>
      <div>
        <ul className="menu-bar list-none flex flex-row items-center gap-3 pr-3">
          <li className="home hover:text-red-200 py-auto">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-red-200">
            <Link to="/about">About</Link>
          </li>
          <li className="hover:text-red-200">
            <Link to="/services">Services</Link>
          </li>
          <li className="hover:text-red-200">
            <Link to="/blog">Blog</Link>
          </li>
          <li className="hover:text-red-200">
            <Link to="/help">Help</Link>
          </li>
          <li className="hover:text-red-200">
            {loginStatus ? (
              <Link to="/logout">Logout</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
          <li className="hover:text-red-200">
            <Link to="/signUp">SignUp</Link>
          </li>
          <li className="ml-5">
            <Link to="/update-user">
              {loginStatus ? (
                <img
                  className="w-12 h-12 rounded-full"
                  src={photo}
                  alt="user-logo"
                />
              ) : (
                <img
                  className="w-12 h-12 rounded-full"
                  src={userImage}
                  alt="user-logo"
                />
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
