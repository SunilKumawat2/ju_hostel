import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import Images from '../../common/images/Images';
import { roomsearch } from '../../../api/Global';
import { ImageUrl } from '../../../config/Config';
import Loader from '../../../loader/Loader';

const HostelBookingRoom = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false)
  const [room_search_details, set_Room_Search_Details] = useState([]);

  useEffect(() => {
    const handle_room_search_details = async () => {
      setIsLoading(true)
      const data = {
        floor_id: id
      }
      try {
        const response = await roomsearch(data);
        if (response?.data?.status == "200") {
          set_Room_Search_Details(response?.data?.data?.rooms)
          setIsLoading(false)
        }
        else {
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    handle_room_search_details()
  }, [])

  return (
    <>
      <Header />
      <div className="top_space pt-115"></div>
      <div className="booking_section">
        <div className="gi-register-wrapper container">
          <h4 className="mb-3 fw-bold">Hostel Details</h4>
          {/* <div className="bg_basic_details position-relative p-3"> */}
          <div className="bg_transparent p-3">
            <div className="rounded card border-0 shadow-sm">
              <div className="card-body hover_floor">
                <div className="row">
                  <div className="col-md-12">
                    <div className="heading_title mb-3">
                      <h5 className="fw-bold">Room</h5>
                    </div>
                  </div>
                  {
                    isLoading ? <Loader /> :
                      <>
                        {
                          room_search_details?.length > 0 ? (
                            <>
                              {
                                room_search_details?.map((room_search_details_result) => {
                                  const isBooked = room_search_details_result?.is_book == "1";

                                  return (
                                    <Link
                                      className={`col-md-3 col-lg-2 mb-4 col-sm-6 col-6 ${isBooked ? "disabled_room" : ""}`}
                                      to={isBooked ? "#" : `/hostel_booking_room_details/${room_search_details_result?.id}`}
                                      key={room_search_details_result?.id}
                                      onClick={(e) => {
                                        if (isBooked) {
                                          e.preventDefault();
                                        } else {
                                          localStorage.setItem("room_images", room_search_details_result?.room_images?.image);
                                        }
                                      }}
                                    >
                                      <div className="floorblog hostelrooms hover_floor"
                                      // style={{ backgroundColor: isBooked ? "rgb(50 151 50)" : "inherit" }} // Light green for booked rooms
                                      >
                                        {
                                          room_search_details_result?.room_icon && isBooked && (
                                            <img src={Images.hostel_room} className="img-fluid" alt='' style={{ width: "80px", height: "80px", overflow: "hidden" }} />
                                          )
                                        }
                                        {
                                          !isBooked && (
                                            <>
                                              {room_search_details_result?.room_icon ? (
                                            <img src={Images.active_room} style={{ width: "80px", height: "80px", overflow: "hidden" }} className="img-fluid" alt='' />
                                                // <img src={`${ImageUrl}${room_search_details_result?.room_icon}`} style={{ width: "80px", height: "80px", overflow: "hidden" }} className="img-fluid" alt='' />
                                              ) : (
                                                <img src={Images.hostel_room} className="img-fluid" alt='' style={{ width: "80px", height: "80px", overflow: "hidden" }} />
                                              )}
                                            </>
                                          )
                                        }


                                        {room_search_details_result?.type === "ac" && (
                                          <h6 className='ac_non_ac'>AC</h6>
                                        )}
                                        {room_search_details_result?.type === "non ac" && (
                                          <h6 className='ac_non_ac1'>Non AC</h6>
                                        )}

                                        <span style={{ color: !isBooked ? "green" : "black", fontWeight: !isBooked ? "bold" : "normal",width:"180px" }}>
                                          {isBooked ? `Room No. ${room_search_details_result?.room_no}` : `Room No. ${room_search_details_result?.room_no}`}
                                        </span>

                                      </div>
                                    </Link>
                                  );
                                })
                              }

                            </>
                          ) : (
                            <div className='text-center'>
                              <p className='text-danger'>Currently, no rooms are available for the selected hostel. Please check back later</p>
                            </div>
                          )
                        }
                      </>
                  }
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </>

  )
}

export default HostelBookingRoom