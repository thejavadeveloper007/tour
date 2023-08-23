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

import UserContext from "./utils/useContext";
import { Provider } from "react-redux";
import store from "./utils/store";

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
        path:"/logout",
        element: <Logout />
      },
      {
        path:"/about",
        element: <About />
      },
      {
        path: "/services",
        element: <Services />
      },
      {
        path: "/help",
        element: <Help />
      }
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={appRouter} />);
