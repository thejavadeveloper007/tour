import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet} from "react-router-dom"

import Header from "./component/Header";
import Body from "./component/Body";
import Footer from "./component/Footer";
import Error from "./component/Error";
import Login from "./component/Login";
import Logout from "./component/Logout";
import About from "./component/About";
import Services from "./component/Services";
import Help from "./component/Help";
import SignUp from "./component/SignUp";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./component/ForgotPassword";
import UpdateUser from "./component/UpdateUser";
import Blog from "./component/Blog";

import UserContext from "./utils/useContext";
import { Provider } from "react-redux";
import store from "./utils/store";
import 'react-toastify/dist/ReactToastify.css';

const AppLayout = () =>{
  const [user, setUser] = useState({
    name: "Ramesh",
    email: "ramesh@gmail.com"
  });
  
  const getUser = async () =>{
    try {
      const url = `${process.env.SERVER_URL}/auth/login/success`
    } catch (error) {
      
    }
  }
  return(
    <>
    <Provider store={store}>
    <UserContext.Provider value={{
        user: user
      }}>
     <Header />
      <Outlet />
     <ToastContainer />
      <Footer />
    </UserContext.Provider>
    </Provider>
    </>
  )
}

const appRouter = createBrowserRouter([
  {
    path:"/",
    element: <AppLayout />,
    errorElement: <Error />,
    children:[
      {
        path: "/",
        element: <Body />
      },
      {
        path: "/signUp",
        element: <SignUp />
      },
      {
        path:"/login",
        element: <Login />
      },
      {
        path:"/forgot-password",
        element: <ForgotPassword />
      },
      {
        path:"/logout",
        element: <Logout />
      },
      {
        path:"/about",
        element: <About />
      },
      {
        path: "/blog",
        element: <Blog />
      },
      {
        path: "/services",
        element: <Services />
      },
      {
        path: "/help",
        element: <Help />
      },
      {
        path: "/update-user",
        element: <UpdateUser />
      },
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);
