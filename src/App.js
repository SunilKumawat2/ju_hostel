import { useEffect } from "react";
import AllRoutes from "./allroutes/AllRoutes";
import './assets/css/animate.min.css'
import './assets/css/bootstrap-datepicker.css'
import './assets/css/bootstrap.min.css'
import './assets/css/default.css'
import './assets/css/flaticon.css'
import './assets/css/font-awesome.min.css'
import './assets/css/magnific-popup.css'
import './assets/css/nice-select.css'
import './assets/css/slick.css'
import './assets/css/style.css'
// import './assets/js/bootstrap.min.js'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Aos from 'aos'
import 'aos/dist/aos.css';
function App() {
const showToast = () => {
        toast.success("message", {
          position: "top-bottom", // Toast position
          autoClose: 2000,        // Automatically close after 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "success",         // or "dark"
        });
    
        toast.error("message", {
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

  useEffect(()=>{
    Aos.init({
        offset:100,
        duration:800,
        easing:'ease-in-sine',
        delay:100,
    });
    Aos.refresh();
  }, [])
  return (
    <div className="App">
      <div>
          <ToastContainer />
        </div>
     <AllRoutes/>
    </div>
  );
}

export default App;
