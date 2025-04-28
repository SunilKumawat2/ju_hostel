import React, { useEffect, useLayoutEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Images from '../../../component/common/images/Images'
import { Link } from 'react-router-dom'
import Footer from '../../common/footer/Footer'
import Gallery from '../../common/gallery/Gallery'
import { get_gallery, homeData, hostelList } from "../../../api/Global"
import { ImageUrl } from '../../../config/Config'
import Loader from '../../../loader/Loader'
import Home_Hostel_Type from './Home_Hostel_Type'
import Home_Transport_Booking from './Home_Transport_Booking'
import Home_Service from './Home_Service'
import Home_Banner from './Home_Banner'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [hostels, setHostels] = useState([])
  console.log("hostels", hostels)
  const [gallery, setGallery] = useState([])
  const [news, setNews] = useState([])
  const [role, setRole] = useState([])

  const PrevButton = ({ onClick }) => (
    <button className="custom-arrow prev" onClick={onClick}>
      <FaChevronLeft />
    </button>
  );

  // Custom Next Button
  const NextButton = ({ onClick }) => (
    <button className="custom-arrow next" onClick={onClick}>
      <FaChevronRight />
    </button>
  );

  const settings = {
    dots: true,
    infinite: gallery?.length > 3,
    speed: 500,
    slidesToShow: gallery?.length >= 3 ? 3 : gallery?.length,
    slidesToScroll: gallery?.length >= 3 ? 3 : 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextButton />,
    prevArrow: <PrevButton />,
    responsive: [
      {
        breakpoint: 1024, // Tablet: Show max 2 images
        settings: {
          slidesToShow: gallery?.length >= 2 ? 2 : gallery?.length,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768, // Mobile: Show 1 image
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Handle image click to open in modal
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  useLayoutEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true)
      try {
        const response = await homeData();
        if (response?.data?.status == 200) {
          setIsLoading(false)
          setHostels(response?.data?.data?.hostels)
          console.log("response?.data?.data?.hostels", response?.data?.data?.hostels)
          // setGallery(response?.data?.data?.gallery)
          setNews(response?.data?.data?.news)
          setRole(response?.data?.data?.role)
        }

      } catch (error) {
        setIsLoading(false)
        console.log(error.message);

      }
    }
    fetchHomeData()
  }, [])

  useEffect(() => {
    const handle_get_gallery = async () => {
      try {
        const response = await get_gallery();
        setGallery(response?.data?.data?.gallery)
      } catch (error) {

      }
    }
    handle_get_gallery();
  }, [])

  return (
    <>
      {/* HEADER START */}
      <Header />
      {/* HEADER END */}

      {/* --====== BANNER PART START ======-- */}
      {
        isLoading ? <Loader /> :
          <div>
            {/* <section className="banner-area banner-style-one">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-md-6">
                    <div className="banner-content">
                      <h1 data-aos="fade-right" className="title wow fadeInLeft" data-aos-delay="500"> Book your Hostel
                        Anywhere, Anytime</h1>
                      <span data-aos="fade-down" className="promo-tag wow fadeInDown" data-aos-delay="300">With Just your smart phone, you can
                        book any hostel in navrongo and pay with momo </span>
                      <ul>
                        <li>
                          <Link data-aos="fade-up" className="main-btn btn-filled wow fadeInUp" data-aos-delay="700" to="/hostel_booking">Get
                            Started</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div data-aos="fade-left" className="col-lg-6 col-md-6 wow fadeInRight" data-aos-delay="500">
                    <div className="banner-thumb d-none d-md-block">
                      <div className="hero-slider-one">
                        <Slider {...settings}>
                          <div className="single-thumb">
                            <video className="custom-video" autoPlay muted loop>
                              <source src={Images?.hostel_video} type="video/mp4" />
                            </video>
                          </div>
                          <div className="single-thumb">
                            <video className="custom-video" autoPlay muted loop>
                              <source src={Images?.hostel_video} type="video/mp4" />
                            </video>
                          </div>
                        </Slider>


                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section> */}
            <Home_Banner />
            {/*====== 	HOSTEL TYPE START ======*/}
            <section className="room-type-section bg-light pt-70 pb-70">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="section-title text-lg-left">
                      <span className="title-tag">Hostel List</span>
                      <h2>Hostel &amp; Rooms</h2>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <ul className="room-filter nav nav-pills justify-content-center justify-content-lg-end" id="room-tab" role="tablist">
                      <li className="nav-item">
                        <Link className="d-none d-md-block" to="/hostel_booking">
                          Hostels
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link className="nav-link" id="luxury-tab" data-bs-toggle="pill" to="#luxury">
                          Rooms
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                </div>
                <div className="tab-content mt-65" id="room-tabContent">
                  <div className="tab-pane fade show active" id="relex" role="tabpanel">
                    <div className="room-items">
                      <div className="row">
                        {hostels?.slice()?.reverse()?.filter((hostel) => hostel?.type == "jecrc")
                          ?.map((hostel) => (
                            <div className="col-lg-3" key={hostel.id}>
                              <div className="room-box extra-height">
                                <div className="room-bg">
                                  <img src={`${ImageUrl}${hostel?.images?.image}`} className="reel" id="image2d" data-stitched={496} data-frames={30} data-frame={15} data-spacing={5} data-rows={3} data-row={2} data-loops="false" alt="" />
                                </div>
                                <div className="room-content">
                                  <h3><Link to="#">{hostel?.name}</Link></h3>
                                  <span className="room-count">
                                    <i className="flaticon-location-pin" />
                                    {hostel?.address}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>

                    </div>
                  </div>
                  <div className="tab-pane fade " id="luxury" role="tabpanel">
                    <div className="room-items">
                      <div className="row">
                        {hostels?.slice(0, 6)?.map((hostel) => (
                          <div className="col-lg-4" key={hostel.id}>
                            <div className="room-box extra-height">
                              <div className="room-bg">
                                <img src={`${ImageUrl}${hostel?.images?.image}`} className="reel" id="image2d" data-stitched={496} data-frames={30} data-frame={15} data-spacing={5} data-rows={3} data-row={2} data-loops="false" alt='' />
                              </div>
                              <div className="room-content">
                                <h3><Link to="#">{hostel?.name}</Link></h3>
                                <span className="room-count"><i className="flaticon-location-pin" />{hostel?.address}</span>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/*====== HOSTEL TYPE END ======*/}
            <Home_Hostel_Type />


            {/*<------------- Transport Booking ------------>*/}
            <Home_Transport_Booking />


            {/*<------- Hostel Services section's ----------> */}
            <Home_Service />


            {/*<------------ gallery section ------------> */}
            <div className="banner-area bg-light pt-70 pb-70">
              <div className="container">
                <div className="row align-items-center justify-content-center justify-content-lg-between">
                  <div data-aos="fade-right" className="col-lg-12 col-md-12 text-center wow fadeInLeft" data-aos-delay="300">
                    <div className="block-text mb-small pl-20">
                      <div className="section-title mb-20">
                        <span className="title-tag">Our Gallery</span>
                        <h2>Explore Now</h2>
                      </div>
                    </div>
                  </div>
                  {/* <div
                    data-aos="fade-right"
                    className="text-center wow fadeInLeft"
                    data-aos-delay="300"
                  >
                    <Slider {...settings}>
                      {gallery?.map((image, index) => (
                        <div key={index} className="image-slide">
                          <img
                            src={`${ImageUrl}${image?.images?.image}`}
                            alt={`gallery-image-${index}`}
                            style={{
                              width: "100%",
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div> */}
                  <div data-aos="fade-right" className="text-center wow fadeInLeft " data-aos-delay="300">
                    <Slider {...settings}>
                      {gallery?.map((image, index) => (
                        <div key={index} className="image-slide">
                          <img src={`${ImageUrl}${image?.image}`} alt={`gallery-image-${index}`} className="slider-image" onClick={() => handleImageClick(`${ImageUrl}${image?.image}`)} style={{ cursor: "pointer" }}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>

                  {selectedImage && (
                    <div className="modal fade show" id="imageModal" tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden={selectedImage ? 'false' : 'true'} style={{ display: 'block' }}>
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedImage(null)}></button>
                          </div>
                          <div className="modal-body">
                            <img src={selectedImage} alt="Selected" className="img-fluid" style={{ width: "100%", height: "400px" }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* gallery section end */}
            <div className="clear-fix" />
            {/*====== LATEST NEWS START ======*/}
            <section className="latest-news bg-white pt-70 pb-70">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-lg-12 text-center">
                    <div className="section-title">
                      <span className="title-tag">News</span>
                      <h2>Our Latest News</h2>
                    </div>
                  </div>
                </div>
                {/* Latest post loop */}
                <div className="row mt-40">
                  {news?.slice(0, 6)?.map((newses) => {
                    const formattedDate = new Date(newses?.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    });
                    return (
                      <div className="col-lg-4">
                        <Link to={`/news_details/${newses?.id}`}>
                          <div className="latest-post-box">
                            <div className="post-img">
                              <img src={`${ImageUrl}${newses?.image}`} style={{ width: "100%", height: "300px" }} alt='' />
                            </div>
                            <div className="post-desc">
                              <ul className="post-meta">
                                <li>
                                  <p><i className="fal fa-calendar-alt me-2" />{formattedDate}</p>
                                </li>
                              </ul>
                              <h4><Link to={`/news_details/${newses?.id}`}>{newses?.title}</Link></h4>
                              <p className="text-truncate-3 text-black">
                                {newses?.short_description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          </div>
      }
      <Footer />
    </>
  )
}

export default Home