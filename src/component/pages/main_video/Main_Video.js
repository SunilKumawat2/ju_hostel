// import React from 'react';
// import Images from '../../common/images/Images';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
// import { Link } from 'react-router-dom';
// const Main_Video = () => {
//   return (
//     <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden">
//       {/* Fullscreen Video */}
//       <video 
//         className="w-100 h-100 object-fit-cover"
//         autoPlay
//         loop
//         muted
//         playsInline
//       >
//         <source src={Images?.main_video} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       {/* Overlay Section - Centered Button */}
//       <div className="position-absolute bottom-0 end-0 p-0 translate-middle text-center">
//         <Link to="/hostel_3d_images" className="btn btn-dark btn-lg">
//           Welcome to JECRC
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Main_Video;


import React, { useRef, useEffect, useState } from "react";
import Images from "../../common/images/Images";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Main_Video = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : 1;
    }
  }, [isMuted]);

  useEffect(() => {
    localStorage.removeItem("JECRC")
    localStorage.removeItem("Other")
  }, [])
  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 overflow-hidden">
      <video ref={videoRef} className="w-100 h-100 object-fit-cover" autoPlay
        loop
        playsInline
      >
        <source src={Images?.main_video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div
        className="position-absolute bottom-0 start-50 translate-middle-x mb-5 text-center"
        style={{ zIndex: 10 }}
      >
        <div className="d-flex align-items-end gap-3">
          <div onClick={() => {
            localStorage.setItem("JECRC", true)
            localStorage.removeItem("Other")
          }}>
            <Link to="/hostel_3d_images" className="btn btn-dark btn-lg fs-6">
              Welcome to JECRC Hostel →
            </Link>
          </div>
          <div onClick={() => {
            localStorage.setItem("Other", true)
            localStorage.removeItem("JECRC")
          }}>
            <Link to="/third_party_home" className="btn btn-success btn-lg fs-6">
              JECRC Collaborated Hostels →
            </Link>

          </div>
          <div onClick={() => {
            localStorage.setItem("Other", true)
            localStorage.removeItem("JECRC")
          }}>
            <Link to="/transport_booking_list" className="btn btn-danger btn-lg fs-6">
              Book Transport →
            </Link>

          </div>

        </div>
      </div>

      <button onClick={() => setIsMuted(!isMuted)} className="position-absolute bottom-0 start-0 m-3 btn btn-light">
        {isMuted ? "🔇 Unmute" : "🔊 Mute"}
      </button>

    </div>
  );
};

export default Main_Video;

