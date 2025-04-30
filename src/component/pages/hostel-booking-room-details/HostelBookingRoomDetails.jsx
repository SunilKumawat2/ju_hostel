import React, { useEffect, useState, useRef, useCallback } from 'react'
import Images from '../../common/images/Images'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { roombook, roomdetail } from '../../../api/Global'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { User_Authentication } from '../../../user_authentication/User_Authentication'
import { Viewer, ImagePanorama } from "panolens";
import { ImageUrl } from '../../../config/Config'
import ReactPannellum, { getConfig } from "react-pannellum";
import Payment_Gateway from '../../../payment_gateway/Payment_Gateway'
import Loader from '../../../loader/Loader'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";

const HostelBookingRoomDetails = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [get_room_details, set_Get_room_details] = useState([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  console.log("selectedPaymentType", selectedPaymentType)
  const [roomPrice, setRoomPrice] = useState(0);
  localStorage.setItem("roomPrice", roomPrice)
  const isUserLoggedIn = User_Authentication();
  const [isExpanded, setIsExpanded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);


  // Define the character limit for preview text (adjust as needed)
  const charLimit = 100; // Show only 100 characters initially
  const photoSphereRef = React.createRef();
  const [room, setRoom] = useState("keuken");

  // Handle text toggle
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle click to log the config
  const handleClick = useCallback(() => {
    console.log(getConfig());
  }, []);

  // Config for the panorama viewer
  const config = {
    autoRotate: -2, // Automatically rotate the image
  };

  // Handle image click to open in modal
  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  useEffect(() => {
    localStorage.setItem("room_details_id", id)
  }, [])

  useEffect(() => {
    const Handle_get_room_details = async () => {
      setIsLoading(true)
      try {
        if (id) {
          const response = await roomdetail(id);
          if (response?.data?.status == "200") {
            setIsLoading(false)
            set_Get_room_details(response?.data?.data);
            localStorage.setItem("hostel_id", response?.data?.data?.room_detail?.hostel_id)
            localStorage.setItem("block_id", response?.data?.data?.room_detail.blog_id)
            localStorage.setItem("floor_id", response?.data?.data?.room_detail.floor_id)
            localStorage.setItem("room_id", response?.data?.data?.room_detail.id)
            localStorage.setItem("transaction_id", "transaction_id")
            localStorage.setItem("payment_method", "Online")
            localStorage.setItem('place', "room_book");
            localStorage.setItem('status', "success");
            // localStorage.setItem('amount', roomPrice);
            localStorage.setItem('booking_period', selectedPaymentType);
            localStorage.setItem('notes', response?.data?.data?.room_detail?.notes);
            setIsLoading(false)
          } else if (response?.response?.data?.status == "500") {
            setIsLoading(false)
            toast.error(response?.response?.data?.message)
          }
          else {
            setIsLoading(false)
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.log("Error fetching room details:", error);
        setIsLoading(false)
      }
    }

    Handle_get_room_details();
  }, [id]);
  console.log("get_room_details", get_room_details)


  const handlePaymentChange = (e) => {
    const selectedType = e.target.value;
    setSelectedPaymentType(selectedType);

    if (selectedType) {
      const selectedPaymentDetails = get_room_details?.room_detail?.room_payments?.find(
        (payment) => payment?.payment_type === selectedType
      );

      if (selectedPaymentDetails) {
        setRoomPrice(selectedPaymentDetails?.room_price);
      }
    } else {
      setRoomPrice(0);
    }
  };


  const handleBookNow = () => {
    if (!isUserLoggedIn) {
      toast.error("User is not logged in.");
      localStorage.setItem("redirect_after_login", `/hostel_booking_room_details/${id}`);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };



  // const handle_room_book_now = async (status, payment_method, transaction_id) => {
  //   const formData = new FormData();
  //   formData.append('hostel_id', get_room_details.room_detail.hostel_id);
  //   formData.append('block_id', get_room_details.room_detail.blog_id);
  //   formData.append('floor_id', get_room_details.room_detail.floor_id);
  //   formData.append('room_id', get_room_details.room_detail.id);
  //   formData.append('transaction_id', transaction_id);
  //   formData.append('payment_method', "Online");
  //   formData.append('place', "room_book");
  //   formData.append('status', "success");
  //   formData.append('amount', roomPrice);
  //   formData.append('booking_period', selectedPaymentType);
  //   formData.append('notes', get_room_details?.room_detail?.notes);

  //   const token = User_Authentication();
  //   if (!token) {
  //     toast.error("User is not logged in.");
  //     setTimeout(() => {
  //       navigate("/login")
  //     }, 2000);
  //   }
  //   try {
  //     const response = await roombook(formData, { Authorization: `Bearer ${token}` });
  //     if (response?.data?.status == "200") {
  //       toast.success(response?.data?.message);
  //       setTimeout(() => {
  //         navigate("/my_booking")
  //       }, 1000)
  //     } else if (response?.response?.data?.status == "401") {
  //       toast.error(response?.response?.data?.message);
  //     }
  //   } catch (error) {
  //     console.log("error", error?.response?.data);
  //     if (error?.response?.data.status == "500") {
  //       toast.error(error?.response?.data?.message);
  //     }
  //   }
  // };



  useEffect(() => {
    if (get_room_details?.room_detail?.room_images?.image) {
      const panoramaImageUrl = `${ImageUrl}${get_room_details?.room_detail?.room_images?.image}`;
      const panorama = new ImagePanorama(panoramaImageUrl);
      const viewer = new Viewer({
        container: document.querySelector("#panorama-container"),
      });

      viewer.add(panorama);
    }
  }, [get_room_details, ImageUrl])

  const handlePaymentSuccess = (transactionId) => {
    console.log("🚀 Payment successful, calling room booking function...");
    // handle_room_book_now("success", "Online", transactionId);
  };

  // Custom Previous Button
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
    // dots: true,
    infinite: get_room_details?.room_detail?.room_images?.length > 2, // Enable infinite loop only if more than 3 images
    speed: 500,
    slidesToShow: get_room_details?.room_detail?.room_images?.length >= 2 ? 2 : get_room_details?.room_detail?.room_images?.length, // Show up to 3, but limit to available images
    slidesToScroll: get_room_details?.room_detail?.room_images?.length >= 2 ? 2 : get_room_details?.room_detail?.room_images?.length, // Scroll based on available images
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextButton />,
    prevArrow: <PrevButton />,
    responsive: [
      {
        breakpoint: 1024, // Tablet: Show 2 images
        settings: {
          slidesToShow: Math.min(1, get_room_details?.room_detail?.room_images?.length),
          slidesToScroll: Math.min(1, get_room_details?.room_detail?.room_images?.length)
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



  return (
    <div>
      {
        isLoading ? (
          <Loader />
        ) : (
          <>
            <Header />
            {/* <-------- ToastContainer ------------> */}
            <ToastContainer style={{ marginTop: "120px" }} />
            <div className="top_space pt-115" />
            <div className="booking_section">
              <div className="gi-register-wrapper container">
                <h4 className="mb-3 fw-bold">Room Details</h4>
                <div className="bg_basic_details position-relative p-1">
                  <div className="bg_transparent">
                    <div className="gi-login-box bg-transparent">
                      <div className="rounded card border-0 shadow-sm">
                        <div className="card-body hover_floor">
                          <div className="row">
                            <div className="col-md-6 col-lg-6">

                              <div className="rounded card border-0 border-end">
                                <div className="card-body room_feature position-relative">
                                  <h4 className="fw-bold">Room Features & Details</h4>
                                  <ul className='mt-3'>
                                    <div className="container">
                                      <div className="row">
                                        <div className="col-md-6 col-12">
                                          <li><b>Hostel Name :</b> {get_room_details?.room_detail?.hostel?.name}</li>
                                        </div>
                                        <div className="col-md-6 col-12">
                                          <li><b>Block :</b> {get_room_details?.room_detail?.blog?.title}</li>
                                        </div>
                                        <div className="col-md-6 col-12">
                                          <li><b>Floor :</b> {get_room_details?.room_detail?.floor?.title}</li>
                                        </div>
                                        <div className="col-md-6 col-12">
                                          <li><b>Room No :</b> {get_room_details?.room_detail?.room_no}</li>
                                        </div>
                                        {/* <div className="col-md-6 col-12">
                                          <li><b>Room Size :</b> {get_room_details?.room_detail?.size}</li>
                                        </div> */}
                                        <div className="col-md-6 col-12">
                                          <li><b>Room Type :</b> {
                                            get_room_details?.room_detail?.type === "ac" ? (
                                              <span className='text-success'>AC</span>
                                            ) : (
                                              <span className='text-danger'>Non AC</span>
                                            )
                                          }</li>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-12 col-12">
                                          <li><b>Description : </b> {get_room_details?.room_detail?.description?.length > charLimit ? (
                                            <>
                                              {isExpanded ? get_room_details?.room_detail?.description : `${get_room_details?.room_detail?.description.substring(0, charLimit)}...`}
                                              <button onClick={toggleText} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontWeight: "bold", marginLeft: "5px" }}>{isExpanded ? "View Less" : "View More"}</button>
                                            </>
                                          ) : (
                                            get_room_details?.room_detail?.description
                                          )}</li>
                                        </div>

                                      </div>
                                      <div className='row'>
                                        <div className="col-md-12 col-12">
                                          <ul className="mt-3">
                                            {
                                              get_room_details?.room_features?.map((get_room_details_result) => {
                                                return (
                                                  <>
                                                    <li><b>{get_room_details_result?.title} : </b>  {get_room_details_result?.description}</li>
                                                  </>
                                                )
                                              })
                                            }
                                          </ul>
                                        </div>
                                      </div>
                                      <div className='row'>

                                        {get_room_details?.room_detail?.room_payments?.map((room_details_price) => {
                                          return (
                                            <span><h6 className="fw-bold">First Installment : </h6> <p className="text-danger fw-bold">Rs. {room_details_price?.room_price || "0"}</p></span>

                                          )
                                        })}
                                      </div>
                                    </div>
                                  </ul>

                                  <div className="mt-4">
                                    <div className="gap-3 align-items-center">
                                      <div className="col-md-6 col-12">
                                        <div className="input-group input-group-two left-icon mb-20">
                                          <label>Please select the booking type</label>
                                          <select name="guest" id="guest" style={{ display: 'flex' }} onChange={handlePaymentChange}
                                            value={selectedPaymentType}>
                                            <option value="" className='option selected focus'>-- Select --</option>
                                            {
                                              get_room_details?.room_detail?.room_payments?.map((get_payment_details_result) => {
                                                return (
                                                  <>
                                                    {
                                                      get_payment_details_result?.payment_type == "1year" && (
                                                        <option className='option' style={{ margin: "5px" }} key={get_payment_details_result.id} value={get_payment_details_result.payment_type}>
                                                          {get_payment_details_result?.payment_type == "1year" && <>First Installment</>}
                                                        </option>
                                                      )
                                                    }

                                                  </>
                                                )
                                              })
                                            }
                                          </select>
                                        </div>
                                      </div>
                                      {
                                        roomPrice > 0 && (
                                          <div className="col">
                                            <h6 className="fw-bold">First Installment</h6>
                                            <h4 className="text-danger fw-bold">Rs. {roomPrice || "0"}</h4>
                                          </div>
                                        )
                                      }
                                    </div>
                                    {/* <div className="form-check mb-2">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="termsCheck"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                      />
                                      <label className="form-check-label text-red-600" htmlFor="termsCheck">
                                        I agree to the Terms and Conditions
                                      </label>
                                    </div>
                                    {!selectedPaymentType ? (
                                      <button className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white col-12 col-md-6 " type="button" disabled={!selectedPaymentType} onClick={handleBookNow}
                                      >
                                        Book Now
                                      </button>
                                    ) : isUserLoggedIn ? (
                                      <Payment_Gateway
                                        Price={roomPrice}
                                        onPaymentSuccess={handlePaymentSuccess}
                                      />
                                    ) : (
                                      <button
                                        className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white col-12 col-md-6"
                                        onClick={handleBookNow}
                                      >
                                        Book Now
                                      </button>
                                    )} */}
                                    <div className="my-4">
                                      {/* Terms and Conditions checkbox */}
                                      <div className="mb-4 d-flex gap-3 items-center space-x-2">
                                        <input
                                          id="termsCheck"
                                          type="checkbox"
                                          checked={termsAccepted}
                                          onChange={(e) => setTermsAccepted(e.target.checked)}
                                          className="h-auto w-[10px] w-auto accent-red-600 border-red-600 rounded focus:ring-0"
                                        />
                                        <label htmlFor="termsCheck" className="text-red-600 text-sm md:text-base">
                                          <Link><span>I agree to the</span> </Link> <Link to={"/terms_conditions"}><span>Terms and Conditions</span> </Link>
                                        </label>

                                      </div>

                                      {/* Booking Button or Payment Gateway */}
                                      {!selectedPaymentType ? (
                                        <button
                                          className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white col-12 col-md-6"
                                          type="button"
                                          disabled={!selectedPaymentType || !termsAccepted}
                                          onClick={handleBookNow}
                                        >
                                          Book Now
                                        </button>
                                      ) : isUserLoggedIn && termsAccepted ? (
                                        <Payment_Gateway
                                          Price={roomPrice}
                                          onPaymentSuccess={handlePaymentSuccess}
                                        />
                                      ) : (
                                        <button
                                          className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white col-12 col-md-6"
                                          type="button"
                                          disabled={!termsAccepted}
                                          onClick={handleBookNow}
                                        >
                                          Book Now
                                        </button>
                                      )}
                                    </div>

                                    {/*
                                     {!selectedPaymentType ? (
                                      <button
                                        className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white"
                                        type="button"
                                        disabled={!selectedPaymentType}
                                        onClick={handle_room_book_now}
                                      >
                                        Book Now
                                      </button>
                                    ) : isUserLoggedIn ? (
                                      <Payment_Gateway
                                        Price={roomPrice}
                                        onPaymentSuccess={handlePaymentSuccess}
                                      />
                                    ) : (
                                      <button
                                        className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white"
                                        onClick={() => {
                                          toast.error("User is not logged in.");
                                          setTimeout(() => {
                                            navigate("/login");
                                          }, 2000);
                                        }}
                                      >
                                        Book Now
                                      </button>
                                    )} */}



                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-12 my-auto">
                              <div className="rounded card border-0">
                                {/* <div>
                                  <ReactPannellum style={{ width: "100%", height: "400px" }}
                                    id="1"
                                    sceneId="firstScene"
                                    imageSource={`${ImageUrl}${get_room_details?.room_detail?.threeDimage}`}
                                    config={config}
                                  />
                                </div> */}
                                <Slider {...settings}>
                                  {get_room_details?.room_detail?.room_images?.map((roomImage, index) => (
                                    <div key={index} className="image-slide1">
                                      {
                                        roomImage?.image_type == "local" ? (
                                          <img
                                            src={`${ImageUrl}${roomImage?.image}`}
                                            alt={`room-image-${index}`}
                                            className="slider-image"
                                            onClick={() => handleImageClick(`${ImageUrl}${roomImage?.image}`)}
                                            style={{ cursor: "pointer" }}
                                          />
                                        ) : (
                                          <img
                                            src={roomImage?.image}
                                            alt={`room-image-${index}`}
                                            className="slider-image"
                                            onClick={() => handleImageClick(`${ImageUrl}${roomImage?.image}`)}
                                            style={{ cursor: "pointer" }}
                                          />
                                        )
                                      }

                                    </div>
                                  ))}
                                </Slider>
                              </div>
                            </div>

                            {/* <div className="container-fluid">
                              <Slider {...settings}>
                                {get_room_details?.room_detail?.room_images?.map((roomImage, index) => (
                                  <div key={index} className="image-slide">
                                    <img
                                      src={`${ImageUrl}${roomImage?.image}`}
                                      alt={`room-image-${index}`}
                                      className="slider-image"
                                      onClick={() => handleImageClick(`${ImageUrl}${roomImage?.image}`)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                ))}
                              </Slider>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />

            {selectedImage && (
              <div
                className="modal fade show"
                id="imageModal"
                tabIndex="-1"
                aria-labelledby="imageModalLabel"
                aria-hidden={selectedImage ? 'false' : 'true'}
                style={{ display: 'block' }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={() => setSelectedImage(null)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <img src={selectedImage} alt="Selected" className="img-fluid" style={{ width: "100%", height: "400px" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}


            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-fullscreen modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body p-0">
                    <div className="Panorama_view" id="container" />
                    <div className="Panorama_view" id="loadFill" />
                    <div className="Panorama_view" id="cover" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }


    </div>

  )
}

export default HostelBookingRoomDetails