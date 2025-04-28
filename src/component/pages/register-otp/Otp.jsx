import React, { useCallback, useState } from 'react'
import Images from '../../component/common/images/Images'
import { Link, useLocation } from 'react-router-dom'
import Header from '../../component/common/header/Header'
import Footer from '../../component/common/footer/Footer'
import OtpExample from '../../component/otp-input/OtpExample'

import {otpMatch} from '../../api/Auth'

import { ToastContainer, toast } from "react-toastify";

const Otp = () => {
  const { state: data } = useLocation();
  const { country_code, mobile } = data || {};
  
console.log(data);


  // Create formdata object
  const formdata = {
    country_code,
    mobile,
    type: "register",
    device_type: "test",
    fcm_token: "dfadsfsdfdsfd",
    temp_id: "5",
    otp: "",
  };

  const [otp, setOtp] = useState('');

  const handleChange = useCallback((inputValue) => {
    setOtp(inputValue); // Update OTP state
    // console.log("Current OTP:", inputValue); // Log the current OTP
  }, []);

  const handleSubmit=async (e)=>{
    e.preventDefault()
    const updatedFormData = { ...formdata, otp };
    const otpLength=(updatedFormData.otp).length
    // console.log(updatedFormData);
    
    // console.log(otpLength);
    // console.log(otp);
    
    
    if(otpLength<4){
      toast.error('please fill all verification code')
      // console.log('please fill all verification code');
      
      return
    }
    try {
      const response = await otpMatch(updatedFormData);
      console.log("API Response:", response);

      if (response.status === 200) {
        console.log(response.data);
        
      }
      console.log(response.data);

    } catch (error) {
      console.error("API Error:", error);
      toast.error(error)
    }
  };
  
  

  return (
  <div>
    <Header/>
  <div className="top_space pt-115" />
  <div className="booking_section pb-115">
    <div className="container">
      <div className="bg_basic_details position-relative p-2">
        <div className="bg_transparent p-2">
          <div className="gi-login-box bg-transparent p-0">
            <div className="multisteps-form__form">
              <div className="multisteps-form__paneldd">
                <div className="row">
                  <div className="col-md-6 col-lg-5">
                    <img src={Images.loginpic} className="img-fluid" alt='' />
                  </div>
                  <div className="col-md-6 col-lg-6 my-auto">
                    <div className="multisteps-form__contents p-5">
                      <h2>Verification code</h2>
                      <h6>We have sent the verification code on your 
                        mobile number - <span className="text-danger">+91********78</span></h6>
                      <form action="#" className="mt-5" onSubmit={(e)=>{handleSubmit(e)}}>
                        <div className="formgrid">
                          <div className="input-group input-group-two left-icon mb-20">
                            <div className="d-flex justify-between gap-md-4 gap-lg-4">
                              {/* <input className="otp text-center" type="text" oninput="digitValidate(this)" onkeyup="tabChange(1)" maxLength={1} />
                              <input className="otp text-center" type="text" oninput="digitValidate(this)" onkeyup="tabChange(2)" maxLength={1} />
                              <input className="otp text-center" type="text" oninput="digitValidate(this)" onkeyup="tabChange(3)" maxLength={1} />
                              <input className="otp text-center" type="text" oninput="digitValidate(this)" onkeyup="tabChange(4)" maxLength={1} /> */}
                            <OtpExample otp={otp} handleChange={handleChange}/>

                            </div>
                          </div>
                          <div className="mb-20 text-center w-100">
                            <p className="text-center text-secondary">Didn’t receive OTP  <Link to="#" className="fw-bold text-danger mt-0 mt-md-4">Resend code</Link></p>
                          </div>
                          <div className="input-group mt-4 input-group-two left-icon mb-20">
                            <button className="btn btn-danger w-100 text-white" type="submit">Verify</button>
                          </div>
                        </div>
                      </form>
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

export default Otp