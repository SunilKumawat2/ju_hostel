import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../component/pages/home/Home'
import Login from '../auth/Login'
import Register from '../auth/Register'
import HostelBooking from '../component/pages/hostel-booking/HostelBooking'
import TransportBooking from '../component/pages/transport-booking/TransportBooking'
import HosteFees from '../component/pages/hostel-fees/HostelFees'
import NewsList from '../component/pages/news-list/NewsList'
import ContactUs from '../component/pages/contact-us/ContactUs'
import HostelBookingRoom from '../component/pages/hostel-booking-room/HostelBookingRoom'
import TransportBookingList from '../component/pages/transport-booking-list/TransportBookingList'
import NewsDetails from '../component/pages/news-details/NewsDetails'
import HostelBookingRoomDetails from '../component/pages/hostel-booking-room-details/HostelBookingRoomDetails'
import TransportPayment from '../component/pages/transport-payment/TransportPayment'
import MyBooking from '../component/pages/my-booking/MyBooking'
import MyTransportBooking from '../component/pages/my-transport-booking/MyTransportBooking'
import TermsConditions from '../component/pages/terms-conditions/TermsConditions'
import PrivacyPolicy from '../component/pages/privacy-policy/PrivacyPolicy'
import HostelRules from '../component/pages/hostel-rules/HostelRules'
import RegisterOtp from '../auth/register-otp/RegisterOtp'
import LoginOtp from '../auth/register-otp/LoginOtp'
import ComplainForm from '../component/pages/complain_form/Complain_form'
import Notice from '../component/pages/notice/Notice'
import User_Profile from '../auth/user_profile/User_Profile'
import Success_Payment from '../component/pages/success_payment/Success_Payment'
import Main_Video from '../component/pages/main_video/Main_Video'
import Hostel_3D_Images from '../component/pages/hostel_3d_image/Hostel_3D_Images'
import Page_Not_Found from '../component/pages/page_not_found/Page_Not_Found'
import Protected_Routes from '../protected/Protected_Routes'
import Third_Party_Home from '../component/pages/third_party_hostel/third_party_home/Third_Party_Home'
import Third_Party_Room_Booking from '../component/pages/third_party_hostel/third_party_room_booking/Third_Party_Room_Booking'


const AllRoutes = () => {
  return (
    <div>
      <Routes >

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/" element={<Main_Video />} />
        <Route path="/hostel_3d_images" element={<Hostel_3D_Images />} />
        <Route path="/hostel_booking" element={<HostelBooking />} />
        <Route path="/transport_booking" element={<TransportBooking />} />
        <Route path="/hostel_fees" element={<HosteFees />} />
        <Route path="/news_list" element={<NewsList />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/hostel_rules" element={<HostelRules />} />
        <Route path="/hostel_booking_room/:id" element={<HostelBookingRoom />} />
        <Route path="/transport_booking_list" element={<TransportBookingList />} />
        <Route path="/news_details/:id" element={<NewsDetails />} />
        <Route path="/hostel_booking_room_details/:id" element={<HostelBookingRoomDetails />} />
        <Route path="/transport_payment" element={<TransportPayment />} />
        {/* <Route path="/my_booking" element={<MyBooking/>}/> */}
        <Route path='/my_booking' element={<Protected_Routes Component={MyBooking} />} />
        {/* <Route path="/my_transport_booking" element={<MyTransportBooking/>}/> */}
        <Route path='/my_transport_booking' element={<Protected_Routes Component={MyTransportBooking} />} />
        <Route path="/terms_conditions" element={<TermsConditions />} />
        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
        <Route path="/register-otp" element={<RegisterOtp />} />
        <Route path="/login-otp" element={<LoginOtp />} />
        {/* <Route path="/complain_form" element={<ComplainForm/>}/> */}
        <Route path='/complain_form' element={<Protected_Routes Component={ComplainForm} />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/user_profile" element={<User_Profile />} />
        <Route path="/payment-success" element={<Success_Payment />} />
        <Route path="/*" element={<Page_Not_Found />} />

        {/* <--------- Third Party hostel --------> */}
        <Route path="/third_party_home" element={<Third_Party_Home />} />
        <Route path="/third_party_room_booking" element={<Third_Party_Room_Booking />} />
      </Routes>
    </div>
  )
}

export default AllRoutes