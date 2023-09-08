import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { GET_BLOGS } from "../utils/constants";

const Blog = () => {
  const [blogContent, setBlogContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

useEffect(() =>{
    console.log('11');
    getBlogs();
},[isSaved]);

async function getBlogs(){
    const token = getTokenFromCookie();
    console.log('token 18',token);
        if(token){
    console.log('token 20',token);
          const { data } = await axios.get(GET_BLOGS,{
            headers:{
                "Authorization": `Bearer ${token}`
            }
          });
          console.log('data',data);
          setBlogs(data?.data);
        }
}

  const handleInput = (e) => {
    setBlogContent(e.target.value);
  };
  const handlePublish = async () => {
    const token = getTokenFromCookie();
    if (token) {
      await axios.post(
        GET_BLOGS,
        { blogContent: blogContent.toString() },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      setBlogContent("");
      setIsSaved(isSaved ? false : true);
    }
  };
  function getTokenFromCookie() {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        console.log('cookie 53', cookie);
        const [name, value] = cookie.trim().split('=');
        if (name === '_secure_RK') {
          console.log('value',value);
          return value;
        }
      }
      return null; // Token not found
    }

  return (
    <div>
      <div className="flex flex-row gap-4 items-start">
        <div className='w-full mx-2 p-2'>
      <div className="text-3xl my-2 font-bold mx-2">My blogs</div>
                {
                    blogs?.map((e) =>(
                        <div className="border border-gray-400 rounded-md m-2 p-2" key={e._id}>
                        <div className="font-bold text-xl">
                            userId: {e?.userId}
                        </div>
                        <div>
                            {e?.blogContent}
                        </div>
                      </div>  
                    ))
                }
            </div>
        <div className="flex flex-col m-2">
            <div className="text-3xl my-2 font-bold mx-2">Publish a new blog</div>
          <textarea
          className="rounded-md"
            rows="10"
            cols="60"
            placeholder="start writing here..."
            value={blogContent}
            onChange={handleInput}
          ></textarea>
          <button
            className="px-4 py-1 bg-cyan-600 rounded-md text-white my-2"
            onClick={handlePublish}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
