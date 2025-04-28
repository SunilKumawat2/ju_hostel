import React, { useCallback, useState } from 'react'
import Images from '../../component/common/images/Images'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OtpExample from '../../component/otp-input/OtpExample'
import ClipLoader from "react-spinners/ClipLoader";
import { otpMatch, registerUser } from '../../api/Auth'
import Header from '../../component/common/header/Header'
import Footer from '../../component/common/footer/Footer'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const RegisterOtp = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { state: data } = useLocation();
  const { country_code, mobile,email, temp_id } = data || {};
  const [otp, setOtp] = useState('');
  const formdata = {
    country_code,
    // mobile,
    email,
    temp_id,
    type: "register",
    device_type: "test",
    fcm_token: "dfadsfsdfdsfd",
    otp: "",
  };

  const register_mobile = localStorage.getItem("register_mobile")
  const register_country_code = localStorage.getItem("register_country_code")
  const register_profileImg = localStorage.getItem("register_profileImg")
  const register_dob = localStorage.getItem("register_dob")
  const register_email = localStorage.getItem("register_email")
  const register_gender = localStorage.getItem("register_gender")
  const register_name = localStorage.getItem("register_name")
  const register_user_role = localStorage.getItem("register_user_role")

  const handleChange = useCallback((inputValue) => {
    setOtp(inputValue);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const updatedFormData = { ...formdata, otp };
    const otpLength = (updatedFormData.otp).length
    if (otpLength < 4) {
      toast.error('please fill all verification code')
      setIsLoading(false)
      return
    }
    try {
      const response = await otpMatch(updatedFormData);
      if (response?.data?.status == "200") {
        toast.success(response?.data?.message)
        localStorage.setItem("name", response?.data?.data?.user?.name)
        localStorage.setItem("mobile", response?.data?.data?.user?.mobile)
        localStorage.setItem("email", response?.data?.data?.user?.email)
        localStorage.setItem("profile_image", response?.data?.data?.user?.profile_image)
        // localStorage.removeItem("register_mobile")
        localStorage.removeItem("register_country_code")
        // localStorage.removeItem("register_profileImg")
        localStorage.removeItem("register_dob")
        // localStorage.removeItem("register_email")
        localStorage.removeItem("register_gender")
        localStorage.removeItem("register_name")
        localStorage.removeItem("register_user_role")
        localStorage.setItem("user_token", response?.data?.data?.token)
        localStorage.setItem("user_is_active", true)
        const redirectPath = localStorage.getItem("redirect_after_login");
        if (redirectPath) {
          localStorage.removeItem("redirect_after_login");
          navigate(redirectPath); 
        } else {
          navigate("/"); 
        }
       
      }
      else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message)
      }

    } catch (error) {
      toast.error(error)
    } finally {
      setIsLoading(false)
    }
  };

  const handle_register_otp_Submit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    // formData.append("mobile", register_mobile)
    formData.append("email", register_email)
    formData.append("user_role", register_user_role)
    formData.append("name", register_name)
    formData.append("gender", register_gender)
    formData.append("email", register_email)
    formData.append("dob", register_dob)
    formData.append("profileImg", register_profileImg)
    formData.append("country_code", register_country_code)

    try {
      const response = await registerUser(formData);
      if (response?.data?.status == '200') {
        toast.success("otp send successfully ")
      } else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message)
      }

    } catch (error) {
      toast.error(error.message)

    } finally {
      setIsLoading(false);
    }

  }

  const maskEmail = (email) => {
    if (!email || email.length) return email; 
    // return `${phone.slice(0, 2)}*******${phone.slice(-2)}`; 
    return `${email}`; 
  };

  const maskedEmail = maskEmail(register_email);
  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      {/* <-------- ToastContainer ------------> */}
      <ToastContainer style={{ marginTop: "120px" }} />
      <div className="booking_section pb-115">
        <div className="container">
          <div className="bg_basic_details position-relative p-2">
            <div className="bg_transparent p-2">
              <div className="gi-login-box bg-transparent p-0">
                <div className="multisteps-form__form">
                  <div className="multisteps-form__paneldd">
                    <div className="row">
                      <div className="col-md-6 col-lg-5 d-none d-md-block">
                        <img src={Images.loginpic} className="img-fluid" alt='' />
                      </div>
                      <div className="col-md-6 col-lg-6 my-auto">
                        <div className="multisteps-form__contents p-2 p-md-5">
                          <h2>Verification code</h2>
                          <h6>We have sent the verification code on your
                            mobile number - <span className="text-danger">{maskedEmail}</span></h6>
                          <form action="#" className="mt-5" onSubmit={(e) => { handleSubmit(e) }}>
                            <div className="formgrid">
                              <div className="input-group input-group-two left-icon mb-20">
                                <div className="d-flex justify-between gap-md-4 gap-lg-4">
                                  <OtpExample otp={otp} handleChange={handleChange} />
                                </div>
                              </div>
                              <div className="mb-20 text-center w-100">
                                <p className="text-center text-secondary">Didn’t receive OTP  <button onClick={handle_register_otp_Submit} className="fw-bold text-danger mt-0 mt-md-4 bg-white" style={{ border: "none" }}>Resend code</button></p>
                              </div>
                              <div className="input-group mt-4 input-group-two left-icon mb-20">
                                <button className="btn btn-danger w-100 text-white" type="submit">
                                  {isLoading ? (
                                    <ClipLoader color="#ffffff" size={20} />
                                  ) : (
                                    "Verify"
                                  )}
                                </button>
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
      <Footer />
    </div>

  )
}

export default RegisterOtp