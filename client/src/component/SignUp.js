import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const googleAuth = () => {
    // console.log('g auth', process.env.SERVER_URL);
    window.open(`http://localhost:7007/auth/google/callback`, "_self");
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    // Perform login logic here
    console.log("Signup with username:", formData.name);
    try {
        const respone = await fetch('http://127.0.0.1:7007/api/v1/user/signup',{
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        });
        // const json = await respone.json();
        console.log('27',respone);
    } catch (error) {
        
    }
  };

  const handleInputChange = (e) => {
    const {name,value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="flex flex-col h-81.6 mx-auto w-64 py-3 items-center gap-1">
    <h1 className="font-bold">SignUp Page</h1>
    <form
      className="flex flex-col items-center my-2 gap-2"
      onSubmit={handleSignUp}
    >
      <div>
        <label className="mx-1" htmlFor="username">
          Username:
        </label>
        <input
          className="border border-gray-500 rounded-full w-full p-1 px-4"
          type="text"
          name="name"
          value={formData.name}
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
          value={formData.email}
          onChange={ handleInputChange}
          required
        />
      </div>
      <div>
        <label className="mr-3" htmlFor="password">
          Password:
        </label>
        <input
          className="border border-gray-500 rounded-full w-full p-1 px-4"
          type="password"
          name="password"
          value={formData.password}
          onChange={ handleInputChange}
          required
        />
      </div>
      <div>
        <label className="mr-3" htmlFor="password">
          Confirm-Password:
        </label>
        <input
          className="border border-gray-500 rounded-full w-full p-1 px-4"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={ handleInputChange}
          required
        />
      </div>
      <button
        className="bg-teal-700 rounded-md mx-auto px-5 py-1 text-white"
        type="submit"
      >
        SignUp
      </button>
    </form>
  </div>
  );
};

export default SignUp;
