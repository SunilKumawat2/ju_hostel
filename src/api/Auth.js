import axios from "axios";
import { BaseUrl } from "../config/Config";

// <---------- user register api ------------>
export const registerUser = async (formdata) => {
  try {
    const response = await axios.post(`${BaseUrl}register`, formdata);
    return response;
  } catch (error) {
    return error;
  }
};

// <----------- otp match api ----------->
export const otpMatch = async (formdata) => {
  try {
    const response = await axios.post(`${BaseUrl}match-otp`, formdata);
    return response;
  } catch (error) {
    return error;
  }
};

// <------------ user login api ----------->
export const loginUser = async (formdata) => {
  try {
    const response = await axios.post(`${BaseUrl}login`, formdata);
    return response;
  } catch (error) {
    return error;
  }
}

// <---------- user logout api --------->
export const logOut = async (header) => {
  try {
    const response = await axios.get(`${BaseUrl}logout`, {
      headers: header
    });
    return response;
  } catch (error) {
    console.error("Error during API call:", error);
    return error;
  }
}

// <------------ user profile api --------->
export const userProfile = async (header) => {
  try {
    const response = await axios.get(`${BaseUrl}user-profile`, {
      headers: header
    });

    return response;
  } catch (error) {
    return error;
  }
}

