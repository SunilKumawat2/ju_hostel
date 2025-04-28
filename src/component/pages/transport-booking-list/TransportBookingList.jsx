import React from 'react'
import Images from '../../common/images/Images'
import { Link } from 'react-router-dom'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'

const TransportBookingList = () => {
  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      <div className="booking_section pb-115">
        <div className="gi-register-wrapper container">
          <div className="pl-115 pr-115">
            <h4 className="mb-3 fw-semibold">Transport Booking</h4>
            <div className="bg_basic_details position-relative p-3">
              <div className="bg_transparent p-3" style={{ backgroundImage: `url(${Images.hostel_map_bg})`, backgroundPosition: 'top center' }}>
                <div className="gi-login-box bg-transparent">
                  <div className="multisteps-form__form">
                    <div className="multisteps-form__paneldd">
                      <h5 className="mb-3 fw-semibold">Transport Booking</h5>
                      <div className="multisteps-form__content">
                        <form action="#">
                          <div class="formgrid">
                            <div class="row">
                              <div class="col-md-10">
                                <div class="input-group input-group-two left-icon mb-20">
                                  <label>Search Rout</label>
                                  <input type="text" placeholder="Jhotwara, Jaipur (Rajasthan)" class="form-control" />
                                </div>
                              </div>
                              <div class="col-md-2 align-items-end d-flex">
                                <div class="input-group input-group-two left-icon mb-20">
                                  <Link to="/transport_booking_list" class="w-100">
                                    <button class="btn btn-danger js-btn-next text-white" type="button">Submit</button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <h5 className="mb-3 fw-semibold">4 Buses Available</h5>
                      <div className="bg-white shadow rounded mt-3">
                        <div className="p-4 py-3 border-bottom">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><i className="fas fa-bus" /> Vikas Travels
                                  Jaipur</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><span className="fw-normal">Driver Name:</span>
                                  John Wick</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="bus_info">
                                <h5 className="fw-semibold text-danger">Rs.450</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-7">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Departure</h6>
                                <h6 className="fw-semibold py-2">Jhotwara, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">08:15 AM</div>
                              </div>
                            </div>
                            <div className="col-md-3 col-lg-3 my-auto">
                              <div className="bus_info">
                                <div className="bg-light small py-2 px-3 text-center rounded-pill">8
                                  Hours 30 minutes</div>
                              </div>
                            </div>
                            {/* <div className="col-md-4 col-lg-4 border-end border-2">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Arrival</h6>
                                <h6 className="fw-semibold py-2">200 Ft Bypass, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">04:15 PM</div>
                              </div>
                            </div> */}
                            <div className="col-md-4 col-lg-2 my-auto">
                              <div className="bus_info ps-0 ps-md-4 ps-lg-4">
                                <Link to="/transport_payment"><button className="btn btn-danger w-100 js-btn-next text-white" type="button">Book Now</button></Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white shadow rounded mt-3">
                        <div className="p-4 py-3 border-bottom">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><i className="fas fa-bus" /> Vikas Travels
                                  Jaipur</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><span className="fw-normal">Driver Name:</span>
                                  John Wick</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="bus_info">
                                <h5 className="fw-semibold text-danger">Rs.450</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Departure</h6>
                                <h6 className="fw-semibold py-2">Jhotwara, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">08:15 AM</div>
                              </div>
                            </div>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info">
                                <div className="bg-light small py-2 px-3 text-center rounded-pill">8
                                  Hours 30 minutes</div>
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4 border-end border-2">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Arrival</h6>
                                <h6 className="fw-semibold py-2">200 Ft Bypass, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">04:15 PM</div>
                              </div>
                            </div>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info ps-0 ps-md-4 ps-lg-4">
                                <Link to="/transport_payment"><button className="btn btn-danger w-100 js-btn-next text-white" type="button">Book Now</button></Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white shadow rounded mt-3">
                        <div className="p-4 py-3 border-bottom">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><i className="fas fa-bus" /> Vikas Travels
                                  Jaipur</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><span className="fw-normal">Driver Name:</span>
                                  John Wick</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="bus_info">
                                <h5 className="fw-semibold text-danger">Rs.450</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="row">
                            <d  iv className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Departure</h6>
                                <h6 className="fw-semibold py-2">Jhotwara, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">08:15 AM</div>
                              </div>
                            </d>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info">
                                <div className="bg-light small py-2 px-3 text-center rounded-pill">8
                                  Hours 30 minutes</div>
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4 border-end border-2">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Arrival</h6>
                                <h6 className="fw-semibold py-2">200 Ft Bypass, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">04:15 PM</div>
                              </div>
                            </div>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info ps-0 ps-md-4 ps-lg-4">
                                <Link to="/transport_payment"><button className="btn btn-danger w-100 js-btn-next text-white" type="button">Book Now</button></Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white shadow rounded mt-3">
                        <div className="p-4 py-3 border-bottom">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><i className="fas fa-bus" /> Vikas Travels
                                  Jaipur</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-center">
                              <div className="bus_info">
                                <h6 className="fw-semibold"><span className="fw-normal">Driver Name:</span>
                                  John Wick</h6>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <div className="bus_info">
                                <h5 className="fw-semibold text-danger">Rs.450</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Departure</h6>
                                <h6 className="fw-semibold py-2">Jhotwara, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">08:15 AM</div>
                              </div>
                            </div>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info">
                                <div className="bg-light small py-2 px-3 text-center rounded-pill">8
                                  Hours 30 minutes</div>
                              </div>
                            </div>
                            <div className="col-md-4 col-lg-4 border-end border-2">
                              <div className="bus_info">
                                <h6 className="fw-normal text-secondary">Arrival</h6>
                                <h6 className="fw-semibold py-2">200 Ft Bypass, Jaipur (Rajasthan)</h6>
                                <div className="fw-semibold small text-danger">04:15 PM</div>
                              </div>
                            </div>
                            <div className="col-md-2 col-lg-2 my-auto">
                              <div className="bus_info ps-0 ps-md-4 ps-lg-4">
                                <button className="btn btn-danger w-100 js-btn-next text-white" type="button">Book Now</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>

  )
}

export default TransportBookingList