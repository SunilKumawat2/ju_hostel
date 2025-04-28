// import React, { useEffect, useState } from 'react';
// import Images from '../../common/images/Images';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { hostelList } from '../../../api/Global';
// import { toast } from 'react-toastify'
// import { useNavigate } from 'react-router-dom';
// import Loader from '../../../loader/Loader';

// const Hostel_3D_Images = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [hostellist, setHostellist] = useState([]);

//     useEffect(() => {
//         const fetchHostelList = async () => {
//             setIsLoading(true)
//             try {
//                 const response = await hostelList();
//                 if (response?.data?.status == "200") {
//                     setIsLoading(false)
//                     setHostellist(response?.data?.data?.hostels)

//                 }
//                 else {
//                     setIsLoading(false)
//                 }
//             } catch (error) {
//                 setIsLoading(false)
//                 // toast(error.message)
//             }
//         }
//         fetchHostelList()
//     }, [])



//     return (
//         <>
//             {
//                 isLoading ? <Loader /> :
//                     <div className="position-relative w-100 vh-100 overflow-hidden Hostel_3D_Images">
//                         <img src={Images?.cropped_images} alt="Hostel 3D View" className="w-100 h-100 object-fit-cover" />
//                         <div className="position-absolute text-center" style={{ top: '62%', left: '40%', width: '4vw' }} >
//                              {/*<------------------- BH1 --------------------> */}
//                             {/* {
//                                 hostellist?.filter(hostel => hostel?.name == "BH1")?.map((hostel, index) => (
//                                         <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2" onClick={() => {
//                                             localStorage.setItem("3d_hostel_id", hostel?.id)
//                                             navigate("/hostel_booking")
//                                         }}>
//                                             {hostel?.name}
//                                         </button>
//                                     ))
//                             } */}

//                         </div>

//                         {/*<------------------- BH2 --------------------> */}
//                         {/* <div className="position-absolute text-center" style={{ top: '52%', left: '42%', width: '4vw' }}>
//                             {
//                                 hostellist?.filter(hostel => hostel?.name == "BH2")?.map((hostel, index) => (
//                                         <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2" onClick={() => {
//                                             localStorage.setItem("3d_hostel_id", hostel?.id)
//                                             navigate("/hostel_booking")
//                                         }}>
//                                             {hostel?.name}
//                                         </button>
//                                     ))
//                             }
//                         </div> */}

//                         {/*<------------------------- BH3 ----------------------------> */}
//                         {/* <div className="position-absolute text-center" style={{ top: '43%', left: '43%', width: '4vw' }}>
//                             {
//                                 hostellist?.filter(hostel => hostel?.name == "BH3")?.map((hostel, index) => (
//                                         <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2" onClick={() => {
//                                             localStorage.setItem("3d_hostel_id", hostel?.id)
//                                             navigate("/hostel_booking")
//                                         }}>
//                                             {hostel?.name}
//                                         </button>
//                                     ))
//                             }
//                         </div> */}

//                         {/*<---------------------------- GH1 ----------------------------------> */}
//                         {/* <div className="position-absolute text-center" style={{ top: '45%', left: '85%', width: '4vw' }}>
//                             {
//                                 hostellist?.filter(hostel => hostel?.name == "GH1")?.map((hostel, index) => (
//                                         <button key={index} className="badge bg-success border-0 fs-6 px-3 py-2" onClick={() => {
//                                             localStorage.setItem("3d_hostel_id", hostel?.id)
//                                             navigate("/hostel_booking")
//                                         }}>
//                                             {hostel?.name}
//                                         </button>
//                                     ))
//                             }
//                         </div> */}
//                     </div>
//             }
//         </>
//     );
// }

// export default Hostel_3D_Images;


import React, { useEffect, useState } from 'react';
import Images from '../../common/images/Images';
import 'bootstrap/dist/css/bootstrap.min.css';
import { hostelList } from '../../../api/Global';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../loader/Loader';

const Hostel_3D_Images = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [hostellist, setHostellist] = useState([]);
    const [topMargin, setTopMargin] = useState('12%');

    useEffect(() => {
        const updateMargin = () => {
            if (window.innerWidth <= 768) {
                setTopMargin('25%'); 
            } else {
                setTopMargin('12%'); 
            }
        };
        updateMargin(); 
        window.addEventListener('resize', updateMargin); 
        return () => window.removeEventListener('resize', updateMargin);
    }, []);

    useEffect(() => {
        const fetchHostelList = async () => {
            setIsLoading(true);
            try {
                const response = await hostelList();
                if (response?.data?.status == "200") {
                    setIsLoading(false);
                    setHostellist(response?.data?.data?.hostels);
                } else {
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
            }
        };
        fetchHostelList();
    }, []);

    return (
        <>
            {isLoading ? <Loader /> :
                <div className="position-relative w-100 vh-100 overflow-hidden Hostel_3D_Images">
                    <img src={Images?.cropped_images} alt="Hostel 3D View" className="w-100 h-100 object-fit-cover" />
                    {/*<---------------- Marquee Message ------------------> */}
                    <div className="position-absolute top-0 w-100 bg-dark text-white py-2">
                        <marquee behavior="scroll" direction="left" className="fs-5 fw-bold">
                            ⚠️ Please click on the labels to select a hostel.
                        </marquee>
                    </div>
                    {/*<----------------- BH3 Hotspot --------------------->*/}
                    <div className="position-absolute text-center" style={{ top: topMargin, left: '80%', width: '4vw' }}>
                        {hostellist?.filter(hostel => hostel?.name == "BH3")?.map((hostel, index) => (
                            <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2"
                                onClick={() => {
                                    localStorage.setItem("3d_hostel_id", hostel?.id);
                                    navigate("/hostel_booking");
                                }}>
                                {hostel?.name}
                            </button>
                        ))}
                    </div>

                    {/*<-------------------------- BH2 Hotspot --------------------->*/}
                    <div className="position-absolute text-center" style={{ top: '63%', left: '20%', width: '4vw' }}>
                        {hostellist?.filter(hostel => hostel?.name == "BH2")?.map((hostel, index) => (
                            <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2"
                                onClick={() => {
                                    localStorage.setItem("3d_hostel_id", hostel?.id);
                                    navigate("/hostel_booking");
                                }}>
                                {hostel?.name}
                            </button>
                        ))}
                    </div>

                    {/*<------------------------ GH1 Hotspot ------------------------->*/}
                    <div className="position-absolute text-center" style={{ top: '43%', left: '55%', width: '4vw' }}>
                        {hostellist?.filter(hostel => hostel?.name == "GH1")?.map((hostel, index) => (
                            <button key={index} className="badge bg-success border-0 fs-6 px-3 py-2"
                                onClick={() => {
                                    localStorage.setItem("3d_hostel_id", hostel?.id);
                                    navigate("/hostel_booking");
                                }}>
                                {hostel?.name}
                            </button>
                        ))}
                    </div>

                    {/*<------------------------- BH1 Hotspot --------------------->*/}
                    <div className="position-absolute text-center" style={{ top: '55%', left: '78%', width: '4vw' }}>
                        {hostellist?.filter(hostel => hostel?.name == "BH1")?.map((hostel, index) => (
                            <button key={index} className="badge bg-danger border-0 fs-6 px-3 py-2"
                                onClick={() => {
                                    localStorage.setItem("3d_hostel_id", hostel?.id);
                                    navigate("/hostel_booking");
                                }}>
                                {hostel?.name}
                            </button>
                        ))}
                    </div>
                </div>
            }
        </>
    );
};

export default Hostel_3D_Images;
