import React, { useEffect, useState } from 'react'
import Footer from '../../common/footer/Footer'
import Header from '../../common/header/Header'
import { toast } from "react-toastify";
import { contactUs, settings } from "../../../api/Global"
import ClipLoader from "react-spinners/ClipLoader";

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [get_settings, set_Get_Settings] = useState({});
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  // <-------- change the input feilds values ---------->
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  // <------------ submit the contact us form details ----------->
  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    for (const [field, value] of Object.entries(formdata)) {
      if (!formdata[field]) {
        toast.error(`${field} is required`);
        setIsLoading(false)
        return
      }
    }
    try {
      const response = await contactUs(formdata)
      if (response?.data?.status == "200") {
        toast.success(response?.data?.message)
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        })
      } else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message)
      }

    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // <-------- get setting's data ----------->
  useEffect(() => {
    const Handle_get_settings = async () => {
      try {
        const response = await settings()
        if (response?.data?.status == "200") {
          set_Get_Settings(response?.data?.data?.setting)
        }
      }
      catch (error) {
        console.log("error",error)
      }
    }
    Handle_get_settings();
  }, [])

  // <-------- when user render on this page then bydeafult the show the page on the top --------->
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <div>
      <Header />
      <section className="contact-part pt-115 pb-115">
        <div className="container">
          <div className="contact-info">
            <div className="row justify-content-center">
              <div className="col-lg-12 col-sm-12 text-center mb-5">
                <div className="section-title text-lg-left">
                  <span className="title-tag">Contact</span>
                  <h2 className="text-danger">Get In&nbsp;Touch !</h2>
                </div>
              </div>
              <div className="col-lg-4 col-sm-12">
                <div className="bg-light py-3">
                  <div className="p-4">
                    <h3 className="fw-bold mb-3">Contact information</h3>
                    <p>Fill up the form and our Team will get back to your 24 hours.</p>
                  </div>
                  <div className="info-box">
                    <div className="icon">
                      <i className="flaticon-phone" />
                    </div>
                    <div className="desc">
                      <h6>Phone Number</h6>
                      <p>{get_settings[0]?.phone}</p>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="icon">
                      <i className="flaticon-message" />
                    </div>
                    <div className="desc">
                      <h6>Email Address</h6>
                      <p>{get_settings[0]?.email}</p>
                    </div>
                  </div>
                  <div className="info-box">
                    <div className="icon">
                      <i className="flaticon-home" />
                    </div>
                    <div className="desc">
                      <h6>Office Address</h6>
                      <p> {get_settings[0]?.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-sm-12">
                <div className="contact-form">
                  <form action="#" method='post' onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-group mb-30">
                          <label>First Name</label>
                          <span className="icon"><i className="far fa-user" /></span>
                          <input type="text" name="name" value={formdata.name} placeholder="Your full name" onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group mb-30">
                          <label>Email ID</label>
                          <span className="icon"><i className="far fa-envelope" /></span>
                          <input type="email" name="email" value={formdata.email} placeholder="Enter email address" onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group mb-30">
                          <label>Phone No.</label>
                          <span className="icon"><i className="far fa-phone" /></span>
                          <input type="text" name='phone' value={formdata.phone} placeholder="Add phone number" onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-group mb-30">
                          <label>Subject</label>
                          <span className="icon"><i className="far fa-book" /></span>
                          <input type="text" name='subject' value={formdata.subject} placeholder="Select Subject" onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="input-group textarea mb-30">
                          <label>Message</label>
                          <span className="icon"><i className="far fa-pen" /></span>
                          <textarea type="text" name='message' value={formdata.message} placeholder="Enter messages" defaultValue={""} onChange={handleChange} />
                        </div>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="main-btn btn-filled" disabled={isLoading}>
                          {isLoading ? (
                            <ClipLoader color="#ffffff" size={20} />
                          ) : (
                            "Submit"
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
      </section>
      <div>
        <iframe src={`${get_settings[0]?.map}`} width="100%" height={450} style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
      <Footer />
    </div>

  )
}

export default ContactUs