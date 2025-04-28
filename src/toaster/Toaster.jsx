import React from 'react'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Toaster = () => {
    const showToast = () => {
        toast.success(message, {
          position: "top-bottom", // Toast position
          autoClose: 2000,        // Automatically close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "success",         // or "dark"
        });
    
        toast.error(message, {
          position: "top-center", // Toast position
          autoClose: 3000,        // Automatically close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",         // or "dark"
        });
      };
  return (
    <div>
    <ToastContainer />
  </div>
  )
}

export default Toaster