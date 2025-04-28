import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { hostelList, hostelSearch } from "../../../api/Global"
import { toast } from 'react-toastify'
import { ImageUrl } from '../../../config/Config'
import Loader from "../../../loader/Loader"

const HostelBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hostellist, setHostellist] = useState([]);
  const get_3d_hostel_id = localStorage.getItem("3d_hostel_id")
  const [selectedHostel, setSelectedHostel] = useState({ id: "", name: "" });
  const [hostel_details, set_Hostel_Details] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchHostelList = async () => {
      try {
        const response = await hostelList();
        if (response?.data?.status == "200") {
          setHostellist(response?.data?.data?.hostels)
        }
      } catch (error) {
        // toast(error.message)
      }
    }
    fetchHostelList()
  }, [])

  // Load stored hostel ID from localStorage when component mounts
  useEffect(() => {
    const storedHostelId = localStorage.getItem("3d_hostel_id");
    if (storedHostelId && hostellist?.length > 0) {
      const foundHostel = hostellist?.find((hostel) => hostel.id === parseInt(storedHostelId));
      if (foundHostel) {
        setSelectedHostel({ id: foundHostel.id, name: foundHostel.name });
      }
    }
  }, [hostellist]);

  // Handle dropdown change
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedHostel = hostellist?.find((hostel) => hostel.id == parseInt(selectedId));

    if (selectedHostel) {
      setSelectedHostel({
        id: selectedHostel.id,
        name: selectedHostel.name,
      });

      // Save selected hostel ID in localStorage
      localStorage.setItem("3d_hostel_id", selectedHostel.id);
    }
  };

  // <------------ handle Change ----------------->
  // const handleChange = (e) => {
  //   const selectedId = e.target.value;
  //   const selectedHostel = hostellist.find((hostel) => hostel.id === parseInt(selectedId));
  //   setHostel({
  //     id: selectedHostel ? selectedHostel?.id : "",
  //     name: selectedHostel ? selectedHostel?.name : "",
  //   });
  // };

  // <--------- Submit the hostel search ------------>
  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    if (!selectedHostel.id) {
      toast.error("Please select a hostel");
      setIsLoading(false)
      return;
    }
    const data = {
      id: selectedHostel.id,
    };
    setIsSubmitted(true);
    try {
      const response = await hostelSearch(data);
      if (response?.data?.status == "200") {
        setIsLoading(false)
        set_Hostel_Details(response?.data?.data?.hostels?.blogs);
      } else {
        set_Hostel_Details([]);
        setIsLoading(false)
        toast.error("No hostels found");
      }
    } catch (error) {
      setIsLoading(false)
      console.error("Error during API call:", error);
      toast.error("An error occurred while searching for hostels");
    }
  };

  useEffect(() => {
    const handle_get_hostel_search = async () => {
      setIsLoading(true)
      const data = {
        id: get_3d_hostel_id
      }
      try {
        const response = await hostelSearch(data)
        if (response?.data?.status == "200") {
          setIsLoading(false)
          set_Hostel_Details(response?.data?.data?.hostels?.blogs);
        } else {
          set_Hostel_Details([]);
          setIsLoading(false)
          toast.error("No hostels found");
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    handle_get_hostel_search();
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <Header compo="hostelbooking" />
      <div className="top_space pt-115" />
      <div className="booking_section pb-115">
        <div className="gi-register-wrapper container">
          <h4 className="mb-3 fw-bold">Hostel Details</h4>
          <div className="bg_basic_details position-relative p-2">
            <div className="bg_transparent">
              <div className="gi-login-box bg-transparent">
                <div className="multisteps-form__contentss">
                  <form action="#" method='post' onSubmit={(e) => { handleSubmit(e) }}>
                    <div className="formgrid">
                      <div className="row">
                        <div className="col-md-10 col-12">
                          <div className="input-group input-group-two left-icon mb-20">
                            <label>Select Hostel</label>
                            {/* <select name="hostel_id" id="guest" style={{ display: 'flex' }} onChange={(e) => { handleChange(e) }} value={hostel?.hostelname}>
                              <option value="" selected>-- Select Hostel -- </option>
                              {
                                hostellist?.map((hostel, key) => (
                                  <option value={hostel?.id} key={hostel?.id} >{hostel?.name}</option>
                                ))
                              }
                            </select> */}
                            {/* <select name="hostel_id" id="guest" style={{ display: "flex" }} onChange={handleChange} value={selectedHostel.id || ""}>
                              <option value="" disabled>
                                -- Select Hostel --
                              </option>
                              {hostellist?.map((hostel) => (
                                <option value={hostel.id} key={hostel?.id}>
                                  {hostel?.name}
                                </option>
                              ))}
                            </select> */}
                            <select name="hostel_id" id="guest" style={{ display: "flex" }} onChange={handleChange} value={selectedHostel.id || ""}>
                              <option value="" disabled>
                                -- Select Hostel --
                              </option>
                              {hostellist
                                ?.filter((hostel) => hostel?.type == "jecrc")?.map((hostel) => (
                                  <option value={hostel.id} key={hostel?.id}>
                                    {hostel?.name}
                                  </option>
                                ))}

                            </select>
                          </div>
                        </div>
                        <div className="col-md-2 col-12 align-items-end d-flex">
                          <div className="input-group input-group-two left-icon mb-25">
                            <button className="btn btn-danger js-btn-next px-2 text-white" type="submit">Submit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* <div className="rounded card border-0 shadow-sm">
                <div className="card-body hover_floor">
                  {
                    isLoading ? <Loader /> :
                      <>
                        {
                          isSubmitted || hostel_details ? (
                            hostel_details?.length > 0 ? (
                              <>
                                {hostel_details?.map((blogs) => (
                                  <div className="row row-with-border" key={blogs.id}>
                                    <div className="col-md-12">
                                      <div className="heading_title mb-3">
                                        <h5 className="fw-bold">{blogs?.title}</h5>
                                      </div>
                                    </div>
                                    {blogs?.floors?.map((floor) => (
                                      <div className="col-md-6 col-lg-3" key={floor.id}>
                                        <div className="floorblog hover_floor">
                                          <Link to={`/hostel_booking_room/${floor?.id}`}>
                                            {floor?.image ? (
                                              <img src={`${ImageUrl}${floor?.image}`} className="img-fluid" alt="floor" />
                                            ) : (
                                              <img src={Images?.hostel_floor01} className="img-fluid" alt="floor" />
                                            )}
                                            <span className='mt-3'><h5>{floor?.title}</h5></span>
                                          </Link>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                ))}
                              </>
                            ) : (
                              // Show this message if no hostel details are found
                              <div className='text-center'>
                                <p className='text-danger'>Currently, no hostel details are available for the selected hostel. Please check back later.</p>
                              </div>
                            )
                          ) : (
                            <div className='text-center'>
                              <p>Please select a hostel to view details.</p>
                            </div>
                          )
                        }
                      </>
                  }
                </div>
              </div> */}


              <div class="bulding_all_floor">
                <div class="bulding_floor">
                  <div className="bulding_all_floor cursor-pointer">
                    <div className="bulding_floor cursor-pointer">
                      {
                        isLoading ? <Loader /> :
                          <>
                            {
                              isSubmitted || hostel_details ? (
                                hostel_details?.length > 0 ? (
                                  <>
                                    {hostel_details
                                      ?.flatMap((hostel) => hostel?.floors || [])
                                      .slice()
                                      .reverse()
                                      .map((floorSrc, floorIndex) => (
                                        <div key={floorIndex} className="bulding_blog relative">
                                          <img className="cursor-pointer" src={`${ImageUrl}${floorSrc?.image}`} alt={floorSrc?.title} />
                                          <Link to={`/hostel_booking_room/${floorSrc?.id}`}>
                                            <span className="floor-label absolute bottom-2 left-2 text-white bg-red-600 px-2 py-1 text-sm rounded">
                                              {floorSrc?.title}
                                            </span>
                                          </Link>
                                        </div>
                                      ))}
                                  </>
                                ) : (
                                  <div className='text-center'>
                                    <p className='text-danger'>Currently, no hostel details are available for the selected hostel. Please check back later.</p>
                                  </div>
                                )
                              ) : (
                                <div className='text-center'>
                                  <p>Please select a hostel to view details.</p>
                                </div>
                              )
                            }
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default HostelBooking