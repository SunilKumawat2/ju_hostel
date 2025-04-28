import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import Images from '../../common/images/Images';
import { get_banner } from '../../../api/Global';
import { ImageUrl } from '../../../config/Config';
import AOS from "aos";
import "aos/dist/aos.css";

const Home_Banner = () => {
    const [isLoading, setIsLoading] = useState([]);
    const [get_home_banner_list, set_Home_Banner_List] = useState({});
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    const [isMuted, setIsMuted] = useState(true); // State for mute/unmute
    const videoRef = useRef(null); // Reference to video element

    // Toggle mute/unmute
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted((prevMuted) => !prevMuted);
        }
    }

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        fade: true,
        arrows: false,
    };

    useEffect(() => {
        const Handle_Get_Hostel_Service = async () => {
            setIsLoading(true)
            try {
                const response = await get_banner();
                if (response?.data?.status == "200") {
                    set_Home_Banner_List(response?.data?.data?.banner)
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
            <section className="banner-area banner-style-one">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-6  order-2 order-md-1 order-lg-1">
                            <div className="banner-content">
                                <h3 data-aos="fade-right" className="title wow fadeInLeft" data-aos-delay="500">{get_home_banner_list?.title}</h3>
                                <span data-aos="fade-down" className="promo-tag wow fadeInDown" data-aos-delay="300">{get_home_banner_list?.description}</span>
                                <ul>
                                    <li>
                                        <Link data-aos="fade-up" className="main-btn btn-filled wow fadeInUp" data-aos-delay="700" to="/hostel_booking">Get Started</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 order-1 order-md-2 order-lg-2">
                            <div className="banner-thumb video_view">

                                {/*<Slider {...settings}>
                          <div className="single-thumb">
                            <img src={Images.banner_01} height={500} width="100%" alt="images" />
                          </div>
                          <div className="single-thumb">
                            <img src={Images.banner_02} height={500} width="100%" alt="images" />
                          </div>
                        </Slider> */}
                                <div className="single-thumb" style={{ position: "relative" }}>
                                    {get_home_banner_list?.video != null ? (
                                        <video
                                            ref={videoRef}
                                            className="custom-video"
                                            autoPlay
                                            loop
                                            muted={isMuted}
                                            style={{ width: "100%", borderRadius: "10px" }}
                                        >
                                            <source src={`${ImageUrl}${get_home_banner_list?.video}`} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <video
                                            ref={videoRef}
                                            className="custom-video"
                                            autoPlay
                                            loop
                                            muted={isMuted}
                                            style={{ width: "100%", borderRadius: "10px" }}
                                        >
                                            <source src={Images?.hostel_video} type="video/mp4" />
                                        </video>
                                    )}

                                    {/* Mute/Unmute Button */}
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
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default Home_Banner
