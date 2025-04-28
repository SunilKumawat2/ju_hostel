import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Third_Party_Home_Banner from './Third_Party_Home_Banner'
import Third_Party_Hostel_Type from './Third_Party_Hostel_Type'
import Third_Party_Home_Transport from './Third_Party_Home_Transport'
import Third_Party_Home_Services from './Third_Party_Home_Services'
import Header from '../../../common/header/Header'
import Footer from '../../../common/footer/Footer'
import Loader from '../../../../loader/Loader'
import { ImageUrl } from '../../../../config/Config';
import { get_gallery, homeData } from '../../../../api/Global';

const Third_Party_Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [hostels, setHostels] = useState([])
  console.log("hostels",hostels)
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
        if (response?.data?.status === 200) {
          setIsLoading(false)
          setHostels(response?.data?.data?.hostels)
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
            <Third_Party_Home_Banner />
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
                        <Link className="d-none d-md-block" to="/third_party_room_booking">
                          Hostels
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="tab-content mt-65" id="room-tabContent">
                  <div className="tab-pane fade show active" id="relex" role="tabpanel">
                    <div className="room-items">
                      <div className="row">
                        {hostels?.slice()?.reverse()?.filter((hostel) => hostel?.type == "other")?.map((hostel) => (
                          <div className="col-lg-3" key={hostel.id}>
                            <Link to={`/third_party_room_booking`}>
                              <div className="room-box extra-height" onClick={() => localStorage.setItem("3d_hostel_id", hostel?.id)}>
                                <div className="room-bg">
                                  <img src={`${ImageUrl}${hostel?.images[0]?.image}`} className="reel" id="image2d" data-stitched={496} data-frames={30} data-frame={15} data-spacing={5} data-rows={3} data-row={2} data-loops="false" alt='' />
                                </div>
                                <div className="room-content">
                                  <h3><Link to="#">{hostel?.name}</Link></h3>
                                  <span className="room-count"><i className="flaticon-location-pin" />{hostel?.address}</span>
                                </div>
                              </div></Link>

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
            <Third_Party_Hostel_Type />


            {/*<------------- Transport Booking ------------>*/}
            <Third_Party_Home_Transport />


            {/*<------- Hostel Services section's ----------> */}
            <Third_Party_Home_Services />


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

export default Third_Party_Home