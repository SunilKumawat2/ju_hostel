import React, { useCallback, useEffect, useState } from 'react'
import Header from '../component/common/header/Header'
import Footer from '../component/common/footer/Footer'
import { Link, useNavigate } from 'react-router-dom'
import Images from '../component/common/images/Images'
import PhoneSelector from '../component/common/phone-input/PhoneSelector'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

// import { parsePhoneNumberFromString } from "libphonenumber-js";
import { loginUser } from '../api/Auth'
import axios from 'axios'
import { homeData } from '../api/Global'

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [user_role, set_User_Role] = useState([])
  // const [email, set_Email] = useState([])
  const [formdata, setFormdata] = useState({
    user_role: '',
    email: '',
    hostel_register_no: '',
    // country_code: '',
    // mobile: ''
  })

  useEffect(() => {
    const Hnadle_Get_User_role = async () => {
      try {
        const response = await homeData();
        if (response?.data?.status == "200") {
          set_User_Role(response?.data?.data?.role)
        }
      }
      catch (error) {
        console.log("error", error)
      }
    }
    Hnadle_Get_User_role();
  }, [])

  const handleChange = useCallback((input, hostel_register_no, email, isPhoneInput = false) => {
    if (isPhoneInput) {
      // const phoneNumber = parsePhoneNumberFromString('+' + input);
      // if (!phoneNumber) {
      setFormdata((prevState) => ({
        ...prevState,
        // mobile: undefined,
        // country_code: undefined
        email: undefined,
        hostel_register_no: undefined
      }));
      // return
      // }

      // const countryCode = phoneNumber.countryCallingCode
      // const nationalNumber = phoneNumber.nationalNumber;

      setFormdata((prevState) => ({
        ...prevState,
        // mobile: nationalNumber,
        // country_code: `+${countryCode}`
        email: email,
        hostel_register_no:hostel_register_no
      }));

    } else {
      const { name, value } = input.target;
      setFormdata((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

  }, [formdata]);
  // console.log(formdata);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const requiredFields = {
      user_role: "The User Roles field is required",
      // mobile: "The Phone number field is required",
      email: "The Email field is required",
      hostel_register_no: "The hostel register no field is required",
    };

    for (const [field, errorMessage] of Object.entries(requiredFields)) {
      if (!formdata[field]) {
        toast(errorMessage);
        setIsLoading(false)
        return;
      }
    }
    try {
      const response = await loginUser(formdata)

      if (response?.data?.status == "200") {
        // localStorage.setItem("mobile", response?.data?.data?.mobile)
        // localStorage.setItem("country_code", response?.data?.data?.country_code)
        localStorage.setItem("email", response?.data?.data?.email)
        localStorage.setItem("user_role", response?.data?.data?.user_role)
        localStorage.setItem("hostel_register_no", response?.data?.data?.hostel_register_no)
        navigate('/login-otp',
          {
            state: {
              // mobile: response?.data?.data?.mobile,
              // country_code: response?.data?.data?.country_code,
              email: response?.data?.data?.email,
              temp_id: response?.data?.data?.id
            }
          }
        )
        toast.success(response?.data?.message)
      } else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message)
      }
      // navigate('/otp', {state:formdata})
      // toast.success("Successfully Login");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }


  }


  return (
    <>
      <div>
        <Header />
        {/* <-------- ToastContainer ------------> */}
        <ToastContainer style={{ marginTop: "120px" }} />
        <div className="top_space pt-115" />
        <div className="booking_section pb-115">
          <div className="gi-register-wrapper container">
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
                            <h2>Login</h2>
                            <h6>Welcome back! Please login to your account.</h6>
                            <form action="#" className="mt-5" method='post' onSubmit={(e) => { handleSubmit(e) }}>
                              <div className="formgrid">
                                <div className='row'>
                                  <div className='col-md-6'>
                                    <div className="input-group input-group-two left-icon mb-20">
                                      <label>User Roles</label>
                                      <select name="user_role" id="guest" style={{ display: 'flex' }} value={formdata.user_role} onChange={(e) => { handleChange(e) }}>
                                        <option value='' selected>-- Select --
                                        </option>
                                        {
                                          user_role?.map((user_role_result) => {
                                            return (
                                              <>
                                                {
                                                  user_role_result?.name == "Student" && (
                                                    <option value={user_role_result?.id}>{user_role_result?.name}</option>
                                                  )
                                                }
                                              </>
                                            )
                                          })
                                        }
                                      </select>
                                    </div>
                                  </div>
                                  <div className='col-md-6'>
                                    <div className="d-inline input-group input-group-two left-icon mb-20 w-100">
                                      <label className="w-100">College Register No</label>
                                      <input type="text" className="form-control" placeholder="College Register No"
                                        name="hostel_register_no" value={formdata.hostel_register_no} onChange={(e) => { handleChange(e) }} />
                                      {/* <PhoneSelector phnumber={`${formdata.country_code}+${formdata.mobile}`} phoneInput={(value) => handleChange(value, true)} /> */}
                                    </div>
                                  </div>
                                  <div className='col-md-12'>
                                    <div className="d-inline input-group input-group-two left-icon mb-20 w-100">
                                      <label className="w-100">Email ID</label>
                                      <input type="email" className="form-control" placeholder="email Id"
                                        name="email" value={formdata.email} onChange={(e) => { handleChange(e) }} />
                                      {/* <PhoneSelector phnumber={`${formdata.country_code}+${formdata.mobile}`} phoneInput={(value) => handleChange(value, true)} /> */}
                                    </div>
                                  </div>
                                  <div className='col-md-12'>
                                    <div className="input-group mt-4 input-group-two left-icon mb-20">
                                      <button className="btn btn-danger w-100 text-white" type="submit">
                                        {isLoading ? (
                                          <ClipLoader color="#ffffff" size={20} />
                                        ) : (
                                          "Send OTP"
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>



                              </div>
                            </form>
                            <p className="text-center text-secondary">Don't have an account ? <Link to="/register" className="fw-bold text-danger mt-0 mt-md-4">Sign UP</Link></p>
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

    </>
  )
}

export default Login