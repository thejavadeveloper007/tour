import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GET_USER, GET_BLOGS } from "../utils/constants";
import Simmer from "./Simmer";

const UpdateUser = () => {
  // const userId = useSelector(store => store.tour?.userId);
  // console.log(localStorage.getItem('id'));
  // console.log('user',userId);
  const token = useSelector((store) => store.tour.token);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    photo: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  useEffect(() => {
    console.log("enter-----------");
    getMe();
  }, []);
  async function getMe() {
    const response = await axios.get(`${GET_USER}/getUserById`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (response) {
      console.log("res 28", response);
      setUserFormData({
        ...userFormData,
        name: response?.data?.data?.name,
        email: response?.data?.data?.email,
        photo: response?.data?.data?.photo
      });
    }
  }

  const handleInputChange = (e) => {
    console.log("input", e.target);
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: value
    })
  };
  const handleImage = async(e) => {
    const file = e.target.files[0];
    setImageUploading(true);
    console.log('file',file);
    console.log('user data',userFormData);
    const signedUrlObj = await axios.post(
      `${GET_BLOGS}/signedUrl`,
      JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("signedUrl", signedUrlObj);
    if(signedUrlObj){
      const signedUrl = signedUrlObj.data.url;
      const response = await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      console.log("response", response);
      setUserFormData({
        ...userFormData,
        photo: signedUrl.split("?")[0], // Capture the selected file
      });
      setImageUploading(false);
    }
  };
  const handleUpdateProfile = async(e) => {
    e.preventDefault();
    
    console.log('handle update me', userFormData  );
    // const formData = new FormData();
    // formData.append('name', userFormData.name);
    // formData.append('email', userFormData.email);
    // formData.append('photo', userFormData?.photoUrl);
    // console.log('form data',formData);
    const updateMe = await axios.patch(`${GET_USER}/updateMe`,userFormData,
    {
      headers:{
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token,
      }
    });
    console.log('updated user',updateMe);
  };

  return userFormData.length === 0 ? (
    <Simmer />
  ) : (
    <div className="h-81.6">
       <div className="">
            <img className="w-40 h-40 bg-cover rounded-full mx-auto my-2" src={userFormData.photo} alt="user-pic" />
          </div>
      <form
        className="flex flex-col justify-start my-2 gap-4 w-80 mx-auto"
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            required
          />
        </div>
        {/* <div>
        <img src="file:///C:\Users\Rakesh Seervi\Downloads\IMG_20221217_004014.jpg" alt="xrf"/>
      </div> */}
        <div className="">
          <label className="mx-1" htmlFor="file">
            Photo:
          </label>
          <input className="" type="file" accept="image/*" onChange={handleImage} />     
        </div>
        <div className="mx-auto">
              {imageUploading ? (
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              ) : (
                <div></div>
              )}
            </div>
        <button
          className="bg-teal-700 rounded-md mx-auto px-5 py-1 text-white"
          type="submit"
        >
          Save
        </button>
      </form>
    </div>
  );
};
export default UpdateUser;
