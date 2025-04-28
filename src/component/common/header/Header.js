import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Images from '../images/Images'
import { User_Authentication } from '../../../user_authentication/User_Authentication'
import { toast } from "react-toastify";
import { logOut, userProfile } from '../../../api/Auth'
import { settings } from '../../../api/Global';
import { ImageUrl } from '../../../config/Config';

const Header = (props) => {
  const { compo } = props
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isToggleMenu, setIsToggleMenu] = useState(false)
  const [loginStatus, setLoginStatus] = useState(false)
  const [userprofile, setUserprofile] = useState({})
  const [get_settings, set_Get_Settings] = useState({});
  const get_jecrc_hostel = localStorage.getItem("JECRC")
  const get_other_hostel = localStorage.getItem("Other")
  const navigate = useNavigate()
  const toggleMenu = () => {
    setIsToggleMenu(!isToggleMenu)
  }
  useEffect(() => {
    const loginStatus = localStorage.getItem('user_is_active')
    setLoginStatus(loginStatus)

  })

  // <------------------ fetch the user profile ------------>
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = User_Authentication();
        if (!token) {
          throw new Error("user token not found");

        }
        const response = await userProfile({ Authorization: `Bearer ${token}` });
        if (response?.data?.status === true) {
          setUserprofile(
            response?.data?.data
          );
        }
        else if (response?.response?.data?.status == "401") {
          localStorage.clear("")
          navigate("/login")

        }
      } catch (error) {
        console.log("error", error)
      }
    }
    fetchUserProfile()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setIsMenuOpen(false);
        setIsToggleMenu(false)

      }
      else {
        setIsMenuOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // <-------- setting api's function ------------->
  useEffect(() => {
    const Handle_get_settings = async () => {
      try {
        const response = await settings()
        if (response?.data?.status == "200") {
          set_Get_Settings(response?.data?.data?.setting)
          localStorage.setItem("invoice_logo", response?.data?.data?.setting[0]?.header_logo)
        }
      }
      catch (error) {
        console.log("error", error)
      }
    }
    Handle_get_settings();
  }, [])

  // <--------- user logout api function ---------->
  const handleLogOut = async () => {
    try {
      const token = User_Authentication();
      if (!token) {
        console.log("token not found");
        return
      }
      const response = await logOut({ Authorization: `Bearer ${token}` });
      if (response?.data?.status == "200") {
        toast.success(response?.data?.message)
        localStorage.clear();
        navigate('/login')
      } else if (response?.response?.data?.status == "500") {
        toast.error(response?.response?.data?.message)
      }
    } catch (error) {
      console.log("arror", error.message);
      toast.error(error.message)
    }
  }

  return (
    <>

      {/* // ====== HEADER START ====== */}
      <header className="header-absolute sticky-header">
        <div className="container container-custom-two">
          <div className={`nav-container d-flex align-items-center justify-content-between ${isMenuOpen && 'breakpoint-on'}`}>
            <div className="site-logo">
              {
                (!get_jecrc_hostel && !get_other_hostel) && (
                  <Link to="/" className="h3 fw-bold text-dark">{
                    get_settings[0]?.footer_logo != null ? (
                      <img src={`${ImageUrl}${get_settings[0]?.header_logo}`} alt="Logo"></img>
                    ) : (
                      <h4 className="fw-bold">JU Hostel & Transport</h4>
                    )
                  }</Link>
                )
              }
              {
                get_jecrc_hostel && (
                  <Link to="/" className="h3 fw-bold text-dark">{
                    get_settings[0]?.footer_logo != null ? (
                      <img src={`${ImageUrl}${get_settings[0]?.header_logo}`} alt="Logo"></img>
                    ) : (
                      <h4 className="fw-bold">JU Hostel & Transport</h4>
                    )
                  }</Link>
                )
              }

              {
                get_other_hostel && (
                  <Link to="/" className="h3 fw-bold text-dark">{
                    get_settings[0]?.footer_logo != null ? (
                      <img src={`${ImageUrl}${get_settings[0]?.header_logo}`} alt="Logo"></img>
                    ) : (
                      <h4 className="fw-bold">JU Hostel & Transport</h4>
                    )
                  }</Link>
                )
              }

            </div>
            <div className={`nav-menu d-lg-flex align-items-center ${isToggleMenu && 'menu-on'}`}>
              <div className="menu-items">
                <ul>
                  {
                    (!get_jecrc_hostel && !get_other_hostel) && (
                      <li>
                        <Link to="/home">Home</Link>
                      </li>
                    )
                  }
                  {
                    get_jecrc_hostel && (
                      <li>
                        <Link to="/home">Home</Link>
                      </li>
                    )
                  }
                  {
                    get_other_hostel && (
                      <li>
                        <Link to="/third_party_home">Home</Link>
                      </li>
                    )
                  }

                  {
                    get_jecrc_hostel && (
                      <li>
                        <Link to="/hostel_booking">Room Booking</Link>
                      </li>
                    )
                  }
                  {
                    get_other_hostel && (
                      <li>
                        <Link to="/third_party_room_booking">Room Booking</Link>
                      </li>
                    )
                  }

                  <li>
                    <Link to="/transport_booking">Transport Booking</Link>
                  </li>
                  <li>
                    <Link to="/hostel_fees">Fee Structure</Link>
                  </li>
                  <li><Link to="/news_list">News</Link></li>
                  <li><Link to="/contact_us">Contact Us</Link></li>
                </ul>
              </div>
              <div className="nav-pushed-item" >
                {
                  loginStatus
                    ?
                    <>
                      <div className="header-info gap-3 d-lg-flex align-items-center">
                      </div>
                      <nav className="navbar dropdown_menu menu-items">
                        <div className="dropdown">
                          <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {
                              userprofile?.profile_image != null ? (
                                <>
                                  <img src={`${ImageUrl}${userprofile?.profile_image}`} className="rounded-circle me-2" width={40} height={40} alt='' /> {userprofile?.name}
                                </>
                              ) : (
                                <>
                                  <img src={Images?.author} className="rounded-circle me-2" width={40} height={40} alt='' /> {userprofile?.name}
                                </>
                              )
                            }
                          </button>
                          <ul className="dropdown-menu">
                            <li><Link className="dropdown-item" to="/my_booking">My Booking</Link></li>
                            {
                              userprofile?.user_role == 1 && (
                                <li><Link className="dropdown-item" to="/complain_form">Complain Form</Link></li>
                              )
                            }
                            <li><Link className="dropdown-item" to="/my_transport_booking">My Transport</Link></li>
                            <li><Link className="dropdown-item" to="/user_profile">Profile</Link></li>
                            <li><Link className="dropdown-item" onClick={() => { handleLogOut() }}>Log Out</Link></li>
                          </ul>
                        </div>
                      </nav>
                    </>
                    :
                    <div className="header-info gap-3 d-lg-flex align-items-center">
                      <Link to="/login">Login</Link>
                      <Link to="/register" className="btn btn-danger">Registration</Link>
                    </div>
                }
              </div>
            </div>
            <div className={`nav-push-item ${isMenuOpen ? 'd-none' : 'd-block'}`}>
              {
                loginStatus
                  ?
                  <>
                    <div className="header-info gap-3 d-lg-flex align-items-center">
                    </div>
                    <nav className="navbar dropdown_menu menu-items">
                      <div className="dropdown">
                        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          {
                            userprofile?.profile_image != null ? (
                              <>
                                <img src={`${ImageUrl}${userprofile?.profile_image}`} className="rounded-circle me-2" width={40} height={40} alt='' /> {userprofile?.name}
                              </>
                            ) : (
                              <>
                                <img src={Images?.author} className="rounded-circle me-2" width={40} height={40} alt='' /> {userprofile?.name}
                              </>
                            )
                          }
                        </button>
                        <ul className="dropdown-menu">
                          <li><Link className="dropdown-item" to="/my_booking">My Hostel</Link></li>
                          <li><Link className="dropdown-item" to="/my_transport_booking">My Transport</Link></li>
                          {
                            userprofile?.user_role == 1 && (
                              <li><Link className="dropdown-item" to="/complain_form">Complain Form</Link></li>
                            )
                          }
                          <li><Link className="dropdown-item" to="/user_profile">Profile</Link></li>
                          <li><Link className="dropdown-item" onClick={() => { handleLogOut() }}>Log Out</Link></li>
                        </ul>
                      </div>
                    </nav>
                  </>
                  :
                  <div className="header-info gap-3 d-lg-flex align-items-center">
                    <Link to="/login">Login</Link>
                    <Link to="/register" className="btn btn-danger">Registration</Link>
                  </div>
              }
            </div>
            <div className={`navbar-toggler ${isToggleMenu && 'active'}`} onClick={() => { toggleMenu() }}>
              <span /><span /><span />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header