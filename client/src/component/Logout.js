import React from 'react'
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';
// import { addLoginStatus } from '../utils/tourSlice';

const Logout = () => {
    // let dispatch = useDispatch();
    const logout = () =>{
        localStorage.removeItem('id');
        document.cookie =  '';
        // toast.success('Logout successful!', {
        //   position: 'top-center',
        //   autoClose: 3000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: false,
        //   draggable: true,
        //   progress: undefined,
        // });
        window.location.href = ('/login');
        // dispatch(addLoginStatus(false));
    }
  return (
    <div className='flex flex-col items-center gap-3 p-4 self-center h-81.6'>
        <h1>Logout from here</h1>
        <button className='bg-teal-400 text-yellow-50 rounded-full hover:bg-teal-500 py-2 px-4' onClick={()=> logout()}>logout</button>
    </div>
  )
}

export default Logout