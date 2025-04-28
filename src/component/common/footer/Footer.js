import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { settings } from '../../../api/Global';
import { ImageUrl } from '../../../config/Config';

const Footer = () => {
  const [get_settings, set_Get_Settings] = useState({});

  useEffect(() => {
    const Handle_get_settings = async () => {
      try {
        const response = await settings()
        if (response?.data?.status == "200") {
          set_Get_Settings(response?.data?.data?.setting)
        }
      }
      catch (error) {
      }
    }
    Handle_get_settings();
  }, [])
  return (
    //  footer-start
    <footer className="footer-two">
      <div className="footer-widget-area light-theme">
        <div className="container-fluid">
          <div className="bg-light p-3 p-lg-5 rounded">
            <div className="row">
              <div className="col-lg-4 col-sm-6">
                {/* Site Info Widget */}
                <div className="widget site-info-widget mb-50">
                  <div className="footer-logo mb-50">
                    {/* <img src="assets/img/footer-logo.png" alt="Logo"> */}
                    {/* <img src="assets/img/footer-logo.png" alt="Logo"> */}
                    <Link to="/home" className="h3 fw-bold text-dark">
                    {
                      get_settings[0]?.footer_logo != null ? (
                        <img src={`${ImageUrl}${get_settings[0]?.footer_logo}`} alt="Logo"></img>
                      ) : (
                        <h4 className="fw-bold">Ju Hostel</h4>
                      )
                    }
                    </Link>
                    
                  </div>
                  <p>{get_settings[0]?.short_description}</p>
                </div>
                <div className="widget nav-widget mb-50">
                <div className="widget site-info-widget">
                      <div className="social-links mt-40">
                        <Link to={get_settings[0]?.facebook}><i className="fab fa-facebook-f" /></Link>
                        <Link to={get_settings[0]?.twitter}><i className="fab fa-twitter" /></Link>
                        <Link to={get_settings[0]?.instagram}><i className="fab fa-instagram" /></Link>
                        <Link to={get_settings[0]?.linkdin}><i className="fab fa-linkedin" /></Link>
                        <Link to={get_settings[0]?.youtube}><i className="fab fa-youtube" /></Link>
                      </div>
                    </div>
                  <div>
                    {/* <h4 className="widget-title">Get the latest information</h4> */}
                    {/* <ul>
                      <li>Newsletter</li>
                    </ul>
                    <form action="#" className="subscribe-form mt-50">
                      <input type="email" placeholder="Enter email address" />
                      <button type="submit">Subscribe</button>
                    </form> */}
                   
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                {/* Nav Widget */}
                <div className="widget nav-widget mb-50">
                  <div>
                    <h4 className="widget-title">
                      Quick Links</h4>
                    <ul>
                      <li><Link to="/contact_us">Contact Us</Link></li>
                      <li><Link to="/hostel_rules">Rules &amp; Regulations </Link></li>
                      <li><Link to="/news_list">News/Announcements</Link></li>
                      <li><Link to="/notice">Notice</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                {/* Contact Widget */}
                <div className="widget contact-widget mb-50">
                  <h4 className="widget-title">Contact Us</h4>
                  <div className="contact-lists">
                    <div className="contact-box">
                      <div className="icon">
                        <i className="flaticon-call" />
                      </div>
                      <div className="desc">
                        <h6 className="title">Phone Number</h6>
                        {get_settings[0]?.phone}
                      </div>
                    </div>
                    <div className="contact-box">
                      <div className="icon">
                        <i className="flaticon-message" />
                      </div>
                      <div className="desc">
                        <h6 className="title">Email Address</h6>
                        <Link to="#">{get_settings[0]?.email}</Link>
                      </div>
                    </div>
                    <div className="contact-box">
                      <div className="icon">
                        <i className="flaticon-location-pin" />
                      </div>
                      <div className="desc">
                        <h6 className="title">Office Address</h6>
                        {get_settings[0]?.address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-5 order-2 order-md-1">
              <p className="copyright-text copyright-two">Copyright @ 2025 Ju Hostel. All Rights Reserved.</p>
            </div>
            <div className="col-lg-6 col-md-7 order-1 order-md-2">
              <div className="footer-menu text-center text-md-end">
                <ul>
                  <li><Link to="/terms_conditions">Terms &amp; Conditions</Link></li>
                  <li><Link to="/privacy_policy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    // footer-end

  )
}

export default Footer