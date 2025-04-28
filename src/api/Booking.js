import axios from "axios";
import { BaseUrl } from "../config/Config";

// <------- my room booking list api --------->
export const my_room_bookings = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}my-room-bookings`, { headers: headers });
    return response;
  } catch (error) {
    throw error;
  }
};

// <------- my transport booking list api --------->
export const my_transport_bookings = async (headers) => {
  try {
    const response = await axios.get(`${BaseUrl}my-transport-bookings`, { headers: headers });
    return response;
  } catch (error) {
    return error;
  }
};


// <-------- cashfree payement gateway --------->
export const create_payment = async (data) => {
  try {
    const response = await axios.post(`${BaseUrl}create-payment`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// <------- my room booking list api --------->
export const room_pay_second_installment = async (data, headers) => {
  try {
    const response = await axios.post(`${BaseUrl}room-pay-second-installment`, data, { headers: headers });
    return response;
  } catch (error) {
    throw error;
  }
};

// <------- my room booking list api --------->
export const transport_pay_second_installment = async (data, headers) => {
  try {
    const response = await axios.post(`${BaseUrl}transport-pay-second-installment`, data, { headers: headers });
    return response;
  } catch (error) {
    throw error;
  }
};