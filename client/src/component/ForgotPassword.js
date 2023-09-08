import React, { useState } from 'react'
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const handleForgotPassword =() =>{
        axios.post(`${process.env.REACT_APP_SERVER_URL}/api/v1/user/forgotPassword`,{email:email},{ headers:{
            'Content-Type': 'application/json'
        }}).then((res) => console.log('res',res))
    }
    const handleInputChange =(event) =>{
        console.log('value',event.target.value);
        setEmail(event.target.value);
    }
  return (
    <div>
        <form onSubmit={handleForgotPassword}>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" value={email} onChange={handleInputChange}/>
            </div>
            <div>
                <button type='submit'>Get the link</button>
            </div>
        </form>
    </div>
  )
}

export default ForgotPassword