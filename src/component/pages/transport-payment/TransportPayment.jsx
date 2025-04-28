import React from 'react'
import Images from '../../common/images/Images'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'

const TransportPayment = () => {
  return (
    <div>
        <Header/>
  <div className="top_space pt-115" />
  <div className="booking_section pb-115">
    <div className="gi-register-wrapper container">
      <div className="pl-115 pr-115">
        <h4 className="mb-3 fw-bold">Payment Now</h4>
        <div className="bg_basic_details position-relative p-3">
          <div className="bg_transparent p-3" style={{backgroundImage: `url(${Images.hostel_map_bg})`}}>
            <div className="gi-login-box bg-transparent">
              <div className="multisteps-form__form">
                <div className="multisteps-form__paneldd">
                  <div className="multisteps-form__content">
                    <div className="row">
                      <div className="col-md-6 text-center my-auto">
                        <div className="transport">
                          <h5 className="mb-3 fw-bold">Payment</h5>
                          <h3 className="fw-bold">Rs. 450/-</h3>
                          <button className="btn btn-danger px-5 mt-4 text-white" type="button">Payment Now</button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="transport">
                          <img src={Images.payment} alt='' />
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
  <Footer/>
</div>

  )
}

export default TransportPayment