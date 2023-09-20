import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { GET_BLOGS } from "../utils/constants";
import Simmer from "./Simmer";
import { useSelector } from "react-redux";

const Blog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageUrl: "",
  });
  const [imageUploading, setImageUploading] = useState(false);
  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  // const [image ,setImage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const loginStatus = useSelector((store) => store.tour.loginStatus);

  const token = useSelector((store) => store.tour.token);

  useEffect(() => {
    console.log("11");
    getBlogs();
  }, [isSaved]);

  async function getBlogs() {
    // const token = getTokenFromCookie();
    // console.log('token 18',token);
    if (token && loginStatus) {
      // console.log('token 20',token);
      const { data } = await axios.get(GET_BLOGS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log('data',data);
      setBlogs(data?.data);
    }
  }

  // const handleInput = (e) => {
  //   setBlogContent(e.target.value);
  // };
  // const handlefile =(e) =>{
  //   console.log('file',e.target?.files[0]);
  //   setFile(e.target?.files[0])
  // }
  const handleInput = (e) => {
    // console.log('e/', e.target);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageUploading(true);
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
    if (signedUrlObj) {
      const signedUrl = signedUrlObj.data.url;
      const response = await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      console.log("response", response);
      setFormData({
        ...formData,
        imageUrl: signedUrl.split("?")[0], // Capture the selected file
      });
      setImageUploading(false);
    }
  };
  const handlePublish = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append('title', title);
    // formData.append('content', content);
    // formData.append('image', image);
    // console.log('formdata',title, formData);
    if (token) {
      console.log("formData", formData);
      await axios.post(GET_BLOGS, JSON.stringify(formData), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        content: "",
        imageUrl: "",
      });
      setIsSaved(isSaved ? false : true);
    }
  };

  const handleDelete = async(id) =>{
    console.log('id',id);
      const deleteRes = await axios.delete(`${GET_BLOGS}/${id}`,{
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('delete res', deleteRes);
      setIsSaved(isSaved ? false : true);
  }

  return !loginStatus ? (
    <Simmer />
  ) : (
    <div className="bg-hero-image bg-cover bg-center h-81.6">
      <div className="flex flex-row gap-4 items-start justify-center bg-opacity-40 rounded-lg shadow-lg p-4 w-3/4 h-3/4 mx-auto my-auto">
        <div className="mx-2 p-2 h-96">
          <div className="text-3xl my-2 font-bold mx-2">My blogs</div>
          {
            blogs.length > 0 ? (<div className="h-80 overflow-auto">
            {blogs?.map((e, index) => (
              <div
                className="border-black border-b-2 border-dashed m-2 p-2"
                key={e._id}
              >
                <div className="flex flex-row justify-between">
                    <h1>
                      {index + 1}. {e?.title}
                    </h1>
                    <button className="bg-teal-500 px-2 text-white rounded-md" onClick={() => handleDelete(e._id)}>delete</button>
                </div>
                <div className="flex justify-center">
                  <img className="h-80 my-2" src={e?.imageUrl} alt="blog-pic" />
                </div>
                <div>{e?.blogContent}</div>
              </div>
            ))}
          </div>) : (<div className="py-10">
            No Blog is there ! Please write one...
          </div>)
          }
        </div>
        <div className="flex flex-col m-2 align-middle content-center items-center">
          <div className="text-3xl my-2 font-bold mx-2">Publish a new blog</div>
          <form
            className="flex flex-col items-start gap-4"
            onSubmit={handlePublish}
          >
            <div>
              <label className="text-xl mr-1">Title:</label>
              <input
                className="appearance-none focus:outline-none border-b-2 border-t-0 border-r-0 border-l-0 bg-transparent py-0"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInput}
              />
            </div>
            <div className="flex align-baseline">
              <label className="text-xl mr-1">Content:</label>
              <textarea
                className="w-96 h-40 bg-transparent border-2 rounded-md"
                name="content"
                value={formData.content}
                onChange={handleInput}
              />
            </div>
            <div>
              <label className="text-xl mr-1">Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="mx-auto">
              {imageUploading ? (
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="mx-auto bg-teal-600 hover:bg-teal-700 rounded-md px-5 py-1 text-white">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Blog;
