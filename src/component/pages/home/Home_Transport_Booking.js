import React, { useEffect, useRef, useState } from 'react'
import { get_web_transport } from '../../../api/Global';
import Images from '../../common/images/Images';
import { Link } from 'react-router-dom';
import { ImageUrl } from '../../../config/Config';
import Loader from '../../../loader/Loader';
import AOS from "aos";
import "aos/dist/aos.css";

const Home_Transport_Booking = () => {
    const [isLoading, setIsLoading] = useState([]);
    const [hostel_transport_type_list, set_Hostel_Transport_List] = useState([]);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    // Prevent pausing by forcing play on any pause event
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const preventPause = () => {
                video.play();
            };
            video.addEventListener("pause", preventPause);
            return () => video.removeEventListener("pause", preventPause);
        }
    }, []);

    const toggleMute = (e) => {
        e.preventDefault();
        setIsMuted((prevMuted) => !prevMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };
    useEffect(() => {
        const Handle_get_hostel_transport_type = async () => {
            setIsLoading(true)
            try {
                const response = await get_web_transport();
                if (response?.data?.status == "200") {
                    set_Hostel_Transport_List(response?.data?.data?.web_transport)
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
        Handle_get_hostel_transport_type();
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
                                <div className={`col-lg-7 col-md-6 order-2 order-md-1 order-lg-1 ${isDesktop ? "wow fadeInLeft" : ""}`}
                                    {...(isDesktop ? { "data-aos": "fade-right", "data-aos-delay": "300" } : {})}>
                                    <div className="block-text mb-small pr-20">
                                        <div className="section-title mb-20">
                                            <span className="title-tag">Transport</span>
                                            <h2>{hostel_transport_type_list && hostel_transport_type_list[0]?.title}</h2>
                                        </div>
                                        <p>{hostel_transport_type_list && hostel_transport_type_list[0]?.description}</p>
                                        <div className="row mt-4">
                                            {
                                                hostel_transport_type_list?.slice(1)?.map((hostel_transport_type_list) => {
                                                    return (
                                                        <div className="col-md-6">
                                                            <div className="d-flex gap-1 align-items-center dorm_room">
                                                                {
                                                                    hostel_transport_type_list?.image != null ? (
                                                                        <img src={`${ImageUrl}${hostel_transport_type_list?.image}`} style={{ width: "70px", height: "70px", borderRadius: "50px" }} alt='' />
                                                                    ) : (
                                                                        <img src={Images.hostel_dorm} alt='' />
                                                                    )
                                                                }
                                                                <div>
                                                                    <h4>{hostel_transport_type_list?.title}</h4>
                                                                    <p>{hostel_transport_type_list?.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <Link to="/transport_booking" className="main-btn btn-filled mt-40">Transport Booking</Link>
                                    </div>
                                </div>
                                <div className={`col-lg-5 col-md-6 order-1 order-md-2 order-lg-2 ${isDesktop ? "wow fadeInRight" : ""}`}
                                    {...(isDesktop ? { "data-aos": "fade-left", "data-aos-delay": "500" } : {})}>
                                    <div className="video-wrap" style={{ position: "relative", width: "100%", maxWidth: "600px", margin: "auto" }}>
                                        {Images?.transport ? (
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                loop
                                                muted={isMuted}
                                                playsInline
                                                style={{
                                                    borderRadius: "50px",
                                                    width: "100%",
                                                    height: "auto",
                                                    aspectRatio: "16/9", // Adjust based on video format
                                                    objectFit: "cover",
                                                    display: "block",
                                                }}
                                                onContextMenu={(e) => e.preventDefault()} // Disable right-click menu
                                            >
                                                <source src={`${Images?.transport}`} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img
                                                src={`${ImageUrl}${hostel_transport_type_list[0]?.image}`}
                                                alt="hostel_02"
                                                style={{ borderRadius: "50px", width: "100%", height: "auto" }}
                                            />
                                        )}

                                        {/* Mute/Unmute Button */}
                                        {Images?.transport && (
                                            <button
                                                onClick={toggleMute}
                                                style={{
                                                    position: "absolute",
                                                    bottom: "10px",
                                                    right: "10px",
                                                    background: "rgba(0, 0, 0, 0.5)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    padding: "10px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {isMuted ? "🔇" : "🔊"}
                                            </button>
                                        )}
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

export default Home_Transport_Booking
