import axios from "axios";
import { BaseUrl } from "../config/Config";

// <--------- submit the complaint form ---------->
export const complaint_Submit = async (data,headers) => {
    try {
        const response = await axios.post(`${BaseUrl}complaint`,data, { headers: headers });
        return response;
    } catch (error) {
        throw error;
    }
};

// <--------- get the complaint list ---------->
export const complaint_list = async (headers) => {
    try {
        const response = await axios.get(`${BaseUrl}get-complaint`, { headers: headers });
        return response;
    } catch (error) {
        throw error;
    }
};