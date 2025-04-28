import axios from "axios";
import { BaseUrl } from "../config/Config";

// <-------- get the terms & condtions -------->
export const termsConditions = async () => {
  try {
    const response = await axios.get(`${BaseUrl}terms-conditions`);
    return response;
  } catch (error) {
    return error;
  }
}

// <-------- get the privacy & Policy -------->
export const privacyPolicy = async () => {
  try {
    const response = await axios.get(`${BaseUrl}privacy-policy`);
    return response;
  } catch (error) {
    return error;
  }
}

// <----------- show the list of the letest news -------->
export const latestNews = async () => {
  try {
    const response = await axios.get(`${BaseUrl}latest-news`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <------------- show the news details api ------------>
export const latestNewsDetails = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}latest-news`, {
      params: {
        id: id,
      }
    });
    return response;
  } catch (error) {
    return error; 
  }
}

// <--------- show the fees structure data ---------->
export const feesStructure = async () => {
  try {
    const response = await axios.get(`${BaseUrl}fee-structure`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <--------- show the rules and regulation's data ----------->
export const rulesRegulation = async () => {
  try {
    const response = await axios.get(`${BaseUrl}rules-and-regulations`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <------------ show the hostel list data ----------->
export const hostelList = async () => {
  try {
    const response = await axios.get(`${BaseUrl}hostel-list`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <---------- hostel search api -------------->
export const hostelSearch = async (data) => {
  try {
    const response = await axios.post(`${BaseUrl}hostel-search`, data);
    return response;
  } catch (error) {
    return error; 
  }
}

// <------------- show the news list -------------->
export const newsList = async () => {
  try {
    const response = await axios.get(`${BaseUrl}latest-news`);
    return response;
  } catch (error) {
    return error;
  }
}

// <------------------ room search api ---------------->
export const roomsearch = async (data) => {
  try {
    const response = await axios.post(`${BaseUrl}room-search`, data);
    return response;
  } catch (error) {
    return error; 
  }
}

// <---------------- show the room details -------------->
export const roomdetail = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}room-detail`, {
      params: {
        id: id,
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};

// <----------- room book api ---------------->
export const roombook = async (data, headers) => {
  try {
    const response = await axios.post(`${BaseUrl}room-book`, data, { headers: headers });
    return response;
  } catch (error) {
    throw error;
  }
};

// <---------------- show the home page data ------------>
export const homeData = async () => {
  try {
    const response = await axios.get(`${BaseUrl}master-data`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <-------------------- settings api ---------------------->
export const settings = async () => {
  try {
    const response = await axios.get(`${BaseUrl}settings`);
    return response;
  } catch (error) {
    return error;
  }
}

// <------------ save the contact form api ------------------->
export const contactUs = async (formdata) => {
  try {
    const response = await axios.post(`${BaseUrl}save-contact-us`, formdata);
    return response;
  } catch (error) {
    return error; 
  }
};

// <--------------- serach route api --------------->
export const search_route = async (formdata) => {
  try {
    const response = await axios.post(`${BaseUrl}search-route`, formdata);
    return response;
  } catch (error) {
    return error; 
  }
};

// <--------------- transport book api --------------->
export const transport_book = async (formdata, headers) => {
  try {
    const response = await axios.post(`${BaseUrl}transport-book`, formdata, { headers: headers });
    return response;
  } catch (error) {
    return error; 
  }
};

// <----------------   get the notice api ------------------>
export const notice = async (formdata, headers) => {
  try {
    const response = await axios.get(`${BaseUrl}notice`, formdata, { headers: headers });
    return response;
  } catch (error) {
    return error; 
  }
};

// <----------------- get the route api ------------>
export const get_route = async (id) => {
  try {
    const response = await axios.get(`${BaseUrl}get-route`, {
      params: {
        id: id,
      }
    });
    return response;
  } catch (error) {
    return error; 
  }
};

// <------ get the web hostel ------------>
export const get_web_hostel = async () => {
  try {
    const response = await axios.get(`${BaseUrl}web-hostel`);
    return response;
  } catch (error) {
    return error; 
  }
}

// <------ get the web hostel ------------>
export const get_web_transport = async () => {
  try {
    const response = await axios.get(`${BaseUrl}web-transport`);
    return response;
  } catch (error) {
    return error;
  }
}

// <------ get the web hostel ------------>
export const get_web_service = async () => {
  try {
    const response = await axios.get(`${BaseUrl}web-service`);
    return response;
  } catch (error) {
    return error;
  }
}

// <------ get the web hostel ------------>
export const get_banner = async () => {
  try {
    const response = await axios.get(`${BaseUrl}banner`);
    return response;
  } catch (error) {
    return error;
  }
}

// <------ get the web hostel ------------>
export const get_gallery = async () => {
  try {
    const response = await axios.get(`${BaseUrl}gallery`);
    return response;
  } catch (error) {
    return error;
  }
}

