import { Link } from "react-router-dom";
import { LOGO_URL } from "../utils/constants"
import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

const Header = () =>{
    // const loginStatus = useSelector(store => store.tour.loginStatus);
    // console.log('login status 9',loginStatus);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
   
    useEffect(()=>{ 
        if(document.cookie.includes('_secure_RK_')){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
    },[])

    const handleLogoutStatus = () =>{
        setIsLoggedIn(false)
    }
    const handleLoginStatus = () =>{
        setIsLoggedIn(true)
    }

    return(
            <div className="flex justify-between p-3 bg-emerald-500 shadow-md items-center">
                <div>
                    <img className="h-12 bg-transparent box-content" src={LOGO_URL} alt="logo" />
                </div>
                <div>
                    <ul className="list-none flex gap-3 pr-3">
                        <li className="hover:text-red-200"><Link to="/">Home</Link></li>
                        <li className="hover:text-red-200"><Link to="/about">About</Link></li>
                        <li className="hover:text-red-200"><Link to="/services">Services</Link></li>
                        <li className="hover:text-red-200"><Link to="/help">Help</Link></li>
                        <li className="hover:text-red-200">
                            {
                                isLoggedIn ? 
                                <Link to="/logout" onClick={()=>handleLogoutStatus()}>Logout</Link>
                                :
                                <Link to="/login" onClick={()=>handleLoginStatus()}>Login</Link>
                            }
                        </li>
                        <li className="hover:text-red-200"><Link to="/signUp">SignUp</Link></li>
                    </ul>
                </div>
            </div>
    )
}

export default Header