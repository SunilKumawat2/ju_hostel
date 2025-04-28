import React, { useEffect, useState } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from '../../../../loader/Loader';
import { get_web_service } from '../../../../api/Global';
import { ImageUrl } from '../../../../config/Config';
import Images from '../../../common/images/Images';

const Third_Party_Home_Services = () => {
    const [isLoading, setIsLoading] = useState([]);
    const [hostel_service_list, set_Hostel_Service_List] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const Handle_Get_Hostel_Service = async () => {
            setIsLoading(true)
            try {
                const response = await get_web_service();
                if (response?.data?.status == "200") {
                    set_Hostel_Service_List(response?.data?.data?.web_service)
                    setIsLoading(false)
                }
                else {
                    setIsLoading(false)
                }
            }
            catch (error) {
                setIsLoading(false)
            }
        }
        Handle_Get_Hostel_Service();
        // Handle screen resizing
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992);
        };

        window.addEventListener("resize", handleResize);

        // Initialize AOS only for desktop
        if (isDesktop) {
            AOS.init({ duration: 1000 });
        }

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [isDesktop])

    return (
        <div>
            {
                isLoading ? <Loader /> : <>
                    <section className="text-block with-bg pt-70 pb-70">
                        <div className="container">
                            <div className="row align-items-center justify-content-center justify-content-lg-between">
                                <div className={`col-lg-4 col-md-6 ${isDesktop ? "wow fadeInRight" : ""}`}
                                    {...(isDesktop ? { "data-aos": "fade-left", "data-aos-delay": "500" } : {})}>
                                    <div className="video-wrap">
                                        {
                                            hostel_service_list && hostel_service_list[0]?.image ? (
                                                <img src={`${ImageUrl}${hostel_service_list[0]?.image}`} alt='hostel_02' style={{ borderRadius: "50px", width: "100%", height: "450px" }} />
                                            ) : (
                                                null
                                                // <img src={Images.hostel_04png} alt='hostel_02' style={{ borderRadius: "50px", width: "100%", height: "450px" }} />
                                            )
                                        }
                                    </div>
                                </div>
                                <div className={`col-lg-8 col-md-6 ${isDesktop ? "wow fadeInLeft" : ""}`}
                                    {...(isDesktop ? { "data-aos": "fade-right", "data-aos-delay": "300" } : {})}>
                                    <div className="block-text mb-small pl-20">
                                        <div className="section-title mb-20">   
                                            {/* <span className="title-tag">Services</span> */}
                                            <h2>{hostel_service_list && hostel_service_list[0]?.title}</h2>
                                        </div>
                                        <p>{hostel_service_list && hostel_service_list[0]?.description}</p>
                                        <div className="row mt-4">
                                            {
                                                hostel_service_list?.slice(1)?.map((hostel_type_list_result) => {
                                                    return (
                                                        <div className="col-md-6">
                                                            <div className="d-flex gap-1 align-items-center dorm_room">
                                                                {
                                                                    hostel_type_list_result?.image != null ? (
                                                                        <img src={`${ImageUrl}${hostel_type_list_result?.image}`} style={{ width: "70px", height: "70px", borderRadius: "50px" }} alt='' />
                                                                    ) : (
                                                                        <img src={Images.hostel_dorm} alt='' />
                                                                    )
                                                                }
                                                                <div>
                                                                    <h4>{hostel_type_list_result?.title}</h4>
                                                                    <p>{hostel_type_list_result?.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                          
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            }

        </div>
    )
}

export default Third_Party_Home_Services
