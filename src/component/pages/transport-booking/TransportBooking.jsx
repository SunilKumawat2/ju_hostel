import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import Images from '../../common/images/Images';
import { get_route, search_route, transport_book } from '../../../api/Global';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { User_Authentication } from '../../../user_authentication/User_Authentication';
import Loader from '../../../loader/Loader';
import Payment_Gateway from '../../../payment_gateway/Payment_Gateway';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Table } from "react-bootstrap";

const TransportBooking = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [show_route_details_modal, set_Route_Details_Modal] = useState(false)
  const [show_route_map_modal, set_Route_Map_Modal] = useState(false)
  const [showNestedModal, setShowNestedModal] = useState(false);
  const [route_from, set_Route_From] = useState("");
  const [route_search_list, set_Route_Search_List] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedDurations, setSelectedDurations] = useState("");
  const [route_details, set_Route_Details] = useState([])
  const [calculatedAmounts, setCalculatedAmounts] = useState(route_search_list[0]?.amount);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState([]);
  const [selectedRouteMap, setSelectedRouteMap] = useState([]);
  const isUserLoggedIn = User_Authentication();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]);

  // Handle the change in duration selection
  const handleDurationChange = (e, routeId, baseAmount) => {
    const selectedValue = e.target.value;
    let newAmount = baseAmount;
    if (selectedValue === "6month") {
      newAmount = baseAmount * 6;
    } else if (selectedValue === "1year") {
      newAmount = baseAmount * 12;
    }
    setSelectedDurations((prev) => ({
      ...prev,
      [routeId]: selectedValue,
    }));

    setCalculatedAmounts((prev) => ({
      ...prev,
      [routeId]: newAmount,
    }));
  };

  useEffect(() => {
    setCalculatedAmounts(route_search_list[0]?.amount);
  }, [route_search_list[0]?.amount]);

  const Handle_search_route = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    const data = {
      route_from: route_from
    }
    setIsSubmitted(true);
    try {
      const response = await search_route(data);
      if (response?.data?.status == "200") {
        set_Route_Search_List(response?.data?.data?.route_detail)
        setIsLoading(false)
        setSelectedDurations("")
      }
      else {
        setIsLoading(false)
      }
    }
    catch (error) {
      console.log("error", error)
      setIsLoading(false)
    }
  }

  const handleSearchChange = async (e) => {
    const searchTerm = e.target.value;
    set_Route_From(searchTerm);

    if (searchTerm.length > 1) {
      try {
        const response = await search_route({ route_from: searchTerm });
        if (response?.data?.status == "200") {
          setFilteredRoutes(response?.data?.data?.route_detail);
        }
      } catch (error) {
        console.log("Error fetching routes", error);
      }
    } else {
      setFilteredRoutes([]);
    }
  };

  const handleSelectRoute = (route) => {
    set_Route_From(route?.route_from); 
    setFilteredRoutes([]); 
  };


  const formatTimeToAMPM = (time) => {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const minutes = minute;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${hours}:${minutes} ${ampm}`;
  };

  const handle_book_transport = async (route_id, transport_id, route_from, amount, status, payment_method, transaction_id) => {
    const formData = new FormData();
    formData.append("route_id", route_id);
    formData.append("transport_id", transport_id);
    formData.append("route_from", route_from);
    formData.append("status", "success");
    formData.append("payment_method", payment_method || "Online");
    formData.append("transaction_id", transaction_id);
    formData.append("amount", amount);
    formData.append("place", "transport_book");
    formData.append("booking_period", "1year");

    const token = User_Authentication();
    if (!token) {
      toast.error("User is not logged in.");
      return;
    }

    try {
      const response = await transport_book(formData, { Authorization: `Bearer ${token}` });
      if (response?.data?.status == "200") {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate("/my_transport_booking");
        }, 1000);
        setSelectedDurations("");
      } else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error in booking transport:", error);
      toast.error("Failed to book transport. Please try again.");
    }
  };

  // Handle successful payment and trigger transport booking
  // const handlePaymentSuccess = ({ transaction_id, status, route_id, transport_id, route_from, amount }) => {
  //   console.log("Payment Success Callback:", { transaction_id, status });

  //   if (status === "success") {
  //     console.log("Payment successful, calling handle_book_transport...");
  //     handle_book_transport(route_id, transport_id, route_from, amount, status, "Online", transaction_id);
  //   } else {
  //     console.error("Payment was not successful.");
  //     toast.error("Payment failed. Please try again.");
  //   }
  // };
  const handlePaymentSuccess = (transactionId) => {
    // handle_room_book_now("success", "Online", transactionId);
  };


  const handleBookNow = () => {
    if (!isUserLoggedIn) {
      toast.error("User is not logged in.");
      localStorage.setItem("redirect_after_login", `/transport_booking`);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      handle_book_transport();
    }
  };

  // Function to convert time (HH:mm:ss) to total minutes
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
  };

  // Function to calculate the time difference between from_time and to_time
  const calculateTimeDifference = (fromTime, toTime) => {
    const fromMinutes = convertTimeToMinutes(fromTime);
    const toMinutes = convertTimeToMinutes(toTime);
    let diffInMinutes = toMinutes - fromMinutes;

    if (diffInMinutes < 0) {
      diffInMinutes += 24 * 60;
    }
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    return { hours, minutes, totalMinutes: diffInMinutes };
  };

  // const handlePaymentSuccess = ({ transaction_id, status, route_id, transport_id, route_from, amount }) => {
  //   console.log("Payment Success Callback:", { transaction_id, status });

  //   if (status === "success") {
  //     console.log("Calling handle_book_transport...");
  //     handle_book_transport(route_id, transport_id, route_from, amount, status, "Online", transaction_id);
  //   } else {
  //     console.error("Payment was not successful.");
  //   }
  // };

  // <-------- Call the View Deatils function --------------->
  const handleShowModal = async (routeId) => {
    try {
      const response = await get_route(routeId);
      setSelectedRouteDetails(response?.data?.data?.route?.route_detail || []);
      set_Route_Details_Modal(true);
    } catch (error) {
      console.error("Error fetching route details:", error);
      setSelectedRouteDetails([]);
    }
  };
  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      <ToastContainer style={{ marginTop: "120px" }} />
      <div className="booking_section pb-115">
        <div className="gi-register-wrapper container">
          <div className="">
            <h4 className="mb-3 fw-bold">Hostel Details</h4>
            <div className="bg_basic_details position-relative p-2">
              <div className="bg_transparent p-2" style={{ backgroundImage: `url(${Images.hostel_map_bg})` }}>
                <div className="gi-login-box bg-transparent">
                  <div className="multisteps-form__form">
                    <div className="multisteps-form__paneldd">
                      <h5 className="mb-3 fw-bold">Transport Booking</h5>
                      <div className="multisteps-form__content">
                        {/* <form action="#" onSubmit={Handle_search_route}>
                          <div class="formgrid">
                            <div class="row">
                              <div class="col-md-10">
                                <div class="input-group input-group-two left-icon mb-20">
                                  <label>Search Route</label>
                                  <input type="text" name='route_from' value={route_from}
                                    onChange={(e) => { set_Route_From(e.target.value) }}
                                    placeholder="Kindly search for the route" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-2 align-items-end d-flex">
                                <div class="input-group input-group-two left-icon mb-20">
                                  <button class="btn btn-danger js-btn-next text-white" type="submit">Submit</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form> */}
                        <form action="#" onSubmit={Handle_search_route}>
                          <div className="formgrid">
                            <div className="row">
                              <div className="col-md-10">
                                <div className="input-group input-group-two left-icon mb-20">
                                  <label>Search Route</label>
                                  <input type="text" name="route_from" value={route_from} onChange={handleSearchChange} placeholder="Kindly search for the route" className="form-control"/>
                                  {filteredRoutes?.length > 0 && (
                                    <ul className="dropdown-list">
                                      {filteredRoutes?.map((route, index) => (
                                        <li key={index} onClick={() => handleSelectRoute(route)}>
                                          {route?.route_from}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-2 align-items-end d-flex">
                                <div className="input-group input-group-two left-icon mb-20">
                                  <button className="btn btn-danger js-btn-next text-white" type="submit">
                                    Submit
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  isLoading ? <Loader /> :
                    <>
                      {
                        isSubmitted ? (
                          route_search_list?.length > 0 ? (
                            <>
                              {route_search_list?.map((route) => (
                                <div className="bg-white shadow rounded mt-3" key={route?.id}>
                                  <div className="p-4 py-3 border-bottom">
                                    <div className="row">
                                      <div className="col-md-3">
                                        <h6 className="fw-semibold">
                                          <i className="fas fa-bus" /> {route?.route?.transport?.busName}
                                        </h6>
                                      </div>

                                      <div className="col-md-3">
                                        <h6 className="fw-semibold">
                                          <span className="fw-normal">Bus No: </span> {route?.route?.transport?.bus_register_no}
                                        </h6>
                                      </div>
                                      <div className="col-md-3 text-md-center  ">
                                        <h6 className="fw-semibold">
                                          <span className="fw-normal">Driver Name:</span> {route?.route?.transport?.driverName}
                                        </h6>
                                      </div>
                                      <div className="col-md-3 text-md-end">
                                        <h5 className="fw-semibold text-danger"><span className="fw-normal">First Installment:</span> Rs.{route?.amount}</h5>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="p-4">
                                    <div className="row">
                                      <div className="col-md-4">
                                        <h6 className="fw-normal text-secondary">Departure</h6>
                                        <h6 className="fw-semibold py-2">{route?.route_from}</h6>
                                      </div>

                                      <div className="col-md-4 col-lg-4 my-auto">
                                        <button className="bg-light small py-2 px-3 text-center rounded-pill" onClick={() => handleShowModal(route?.id)}>
                                          View Details
                                        </button>
                                        <button
                                          className="bg-light small py-2 px-3 text-center rounded-pill m-2"
                                          onClick={() => set_Route_Map_Modal(true)}
                                        >
                                          View Map
                                        </button>
                                      </div>

                                      <div className="col-md-4 col-lg-4 my-auto" onClick={() => {
                                        localStorage.setItem("route_id", route?.id);
                                        localStorage.setItem("transport_id", route?.route?.transport_id);
                                        localStorage.setItem("route_from", route?.route_from);
                                        localStorage.setItem("transport_amount", route?.amount);
                                      }}
                                      >
                                        {
                                          isUserLoggedIn ? (
                                            // <Payment_Gateway
                                            //   Price={route?.amount}
                                            //   onPaymentSuccess={({ transaction_id, status }) =>
                                            //     handlePaymentSuccess({
                                            //       transaction_id,
                                            //       status: status,
                                            //       route_id: route?.id,
                                            //       transport_id: route?.route?.transport_id,
                                            //       route_from: route?.route_from,
                                            //       amount: route?.amount
                                            //     })
                                            //   }
                                            // />
                                            <Payment_Gateway
                                              Price={route?.amount}
                                              onPaymentSuccess={handlePaymentSuccess}
                                            />
                                          ) : (
                                            <button className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white" onClick={handleBookNow}>
                                              Book Now
                                            </button>
                                          )
                                        }
                                      </div>
                                    </div>
                                  </div>
                                  <Modal show={show_route_map_modal} onHide={() => set_Route_Map_Modal(false)} centered size="lg">
                                    <Modal.Header closeButton>
                                      <Modal.Title>Location Map</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <div>
                                        <iframe
                                          src={route?.route?.map_url || "https:\/\/www.google.com\/maps\/embed?pb=!1m18!1m12!1m3!1d227748.43602619463!2d75.62574632182506!3d26.88542138958921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1735370792894!5m2!1sen!2sin"}
                                          width="100%"
                                          height="450"
                                          style={{ border: 0 }} 
                                          allowFullScreen
                                          loading="lazy"
                                          referrerPolicy="no-referrer-when-downgrade"
                                        />
                                      </div>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={() => set_Route_Map_Modal(false)}>
                                        Close
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                </div>
                              ))}


                              <Modal show={show_route_details_modal} onHide={() => set_Route_Details_Modal(false)} centered size="lg">
                                <Modal.Header closeButton>
                                  <Modal.Title>Route Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>

                                  {selectedRouteDetails?.length > 0 ? (
                                    <Table striped bordered hover responsive>
                                      <thead className="bg-danger text-white">
                                        <tr>
                                          <th>ID</th>
                                          <th>Route From</th>
                                          <th>Route From Time</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {selectedRouteDetails?.map((detail, index) => (
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{detail?.route_from}</td>
                                            <td>{detail?.from_point_time}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  ) : (
                                    <p>No route details available.</p>
                                  )}
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={() => set_Route_Details_Modal(false)}>
                                    Close
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </>
                          ) : (
                            <div className='text-center'>
                              <p className='text-danger'>Currently, no route details are available for the selected route. Please check back later.</p>
                            </div>
                          )
                        ) : (
                          null
                        )
                      }
                    </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <----------- this is footer section's --------------> */}
      <Footer />
    </div>

  )
}

export default TransportBooking