


// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import { BaseUrl } from "../../../config/Config";

// const Success_Payment = () => {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const orderId = queryParams.get("order_id"); 
//     const [status, setStatus] = useState("pending");

//     useEffect(() => {
//         console.log("🔹 Extracted orderId from URL:", orderId);

//         if (orderId) {
//             axios
//                 .get(`${BaseUrl}get-payment-status?order_id=${orderId}`)
//                 .then((response) => {
//                     console.log("Payment Status API Response:", response.data);
//                     setStatus(response.data.order_status);
//                 })
//                 .catch((error) => {
//                     console.error("Error fetching payment status:", error);
//                     setStatus("failed"); 
//                 });
//         }
//     }, [orderId]);

//     return (
//         <div>
//             <h2>Payment Status: {status.toUpperCase()}</h2>
//         </div>
//     );
// };

// export default Success_Payment;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../../config/Config";
import { usePayment } from "../../../contexts/PaymentContext";
import { User_Authentication } from "../../../user_authentication/User_Authentication";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { roombook, transport_book } from "../../../api/Global";
import { room_pay_second_installment, transport_pay_second_installment } from "../../../api/Booking";

const Success_Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("order_id");
    const [status, setStatus] = useState("pending");
    const [isBookingInitiated, setIsBookingInitiated] = useState(false);
    const { setPaymentStatus, setTransactionId } = usePayment();
    const hostel_id = localStorage.getItem("hostel_id");
    const block_id = localStorage.getItem("block_id");
    const floor_id = localStorage.getItem("floor_id");
    const room_id = localStorage.getItem("room_id");
    const payment_method = localStorage.getItem("payment_method") || "Online";
    const place = localStorage.getItem("place") || "room_book";
    const roomPrice = localStorage.getItem("roomPrice");
    const booking_period = localStorage.getItem("booking_period");
    const notes = localStorage.getItem("notes");
    const route_id = localStorage.getItem("route_id")
    const transport_id = localStorage.getItem("transport_id")
    const route_from = localStorage.getItem("route_from")
    const transport_amount = localStorage.getItem("transport_amount")
    const booking_id = localStorage.getItem("booking_id")
    const user_id = localStorage.getItem("user_id")
    const second_installment = localStorage.getItem("second_installment")
    const transport_second_installment = localStorage.getItem("transport_second_installment")
    const transport_user_id = localStorage.getItem("transport_user_id")
    const transport_booking_id = localStorage.getItem("transport_booking_id")

    const handle_room_book_now = async (transaction_id) => {
        if (isBookingInitiated) return;
        setIsBookingInitiated(true);
        const formData = new FormData();
        formData.append("hostel_id", hostel_id);
        formData.append("block_id", block_id);
        formData.append("floor_id", floor_id);
        formData.append("room_id", room_id);
        formData.append("transaction_id", transaction_id);
        formData.append("payment_method", payment_method);
        formData.append("place", place);
        formData.append("status", "success");
        formData.append("amount", roomPrice);
        formData.append("booking_period", booking_period);
        formData.append("notes", notes);

        const token = User_Authentication();
        if (!token) {
            toast.error("User is not logged in.");
            setTimeout(() => navigate("/login"), 2000);
            return;
        }

        try {
            const response = await roombook(formData, { Authorization: `Bearer ${token}` });
            if (response?.data?.status == "200") {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate("/my_booking");
                }, 1000)
                setTimeout(() => {
                    localStorage.removeItem("notes");
                    localStorage.removeItem("booking_period");
                    localStorage.removeItem("amount");
                    localStorage.removeItem("status");
                    localStorage.removeItem("place");
                    localStorage.removeItem("payment_method");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("room_id");
                    localStorage.removeItem("floor_id");
                    localStorage.removeItem("block_id");
                    localStorage.removeItem("hostel_id");
                }, 5000);
            } else if (response?.response?.data?.status == "401") {
                toast.error(response?.response?.data?.message);
            }
        } catch (error) {
            console.error("Error:", error?.response?.data);
            if (error?.response?.data.status == "500") {
                // toast.error(error?.response?.data?.message);
            }
        }
    };

    const handle_book_transport = async (transaction_id) => {
        const formData = new FormData();
        formData.append("route_id", route_id);
        formData.append("transport_id", transport_id);
        formData.append("route_from", route_from);
        formData.append("status", "success");
        formData.append("payment_method", "Online");
        formData.append("transaction_id", transaction_id);
        formData.append("amount", transport_amount);
        formData.append("place", "transport_book");
        formData.append("booking_period", "1year");

        const token = User_Authentication();
        if (!token) {
            toast.error("User is not logged in.");
            return;
        }

        try {
            console.log("Calling transport_book API...");
            const response = await transport_book(formData, { Authorization: `Bearer ${token}` });

            console.log("API Response:", response);
            if (response?.data?.status == "200") {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate("/my_transport_booking");
                }, 1000);

                setTimeout(() => {
                    localStorage.removeItem("route_id");
                    localStorage.removeItem("transport_id");
                    localStorage.removeItem("route_from");
                    localStorage.removeItem("status");
                    localStorage.removeItem("payment_method");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("amount");
                    localStorage.removeItem("place");
                    localStorage.removeItem("booking_period");
                }, 5000);
                // setSelectedDurations("");
            } else if (response?.response?.data?.status == "500") {
                // toast.error(response?.response?.data?.message);
            }
        } catch (error) {
            // console.error("Error in booking transport:", error);
            // toast.error("Failed to book transport. Please try again.");
        }
    };

    const handle_room_pay_second_installment = async (transaction_id) => {
        const formData = new FormData();
        formData.append("room_id", room_id);
        formData.append("booking_id", booking_id);
        formData.append("user_id", user_id);
        formData.append("transaction_id", transaction_id);
        formData.append("payment_method", "Online");
        formData.append("place", place);
        formData.append("amount", second_installment);
        formData.append("status", "success");

        const token = User_Authentication();
        if (!token) {
            toast.error("User is not logged in.");
            return;
        }
        try {
            console.log("Calling transport_book API...");
            const response = await room_pay_second_installment(formData, { Authorization: `Bearer ${token}` });

            console.log("API Response:", response);
            if (response?.data?.status == "200") {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate("/my_booking");
                }, 1000);

                setTimeout(() => {
                    localStorage.removeItem("room_id");
                    localStorage.removeItem("booking_id");
                    localStorage.removeItem("user_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("payment_method");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("amount");
                    localStorage.removeItem("place");
                    localStorage.removeItem("booking_period");
                }, 5000);
                // setSelectedDurations("");
            } else if (response?.response?.data?.status == "500") {
                // toast.error(response?.response?.data?.message);
            }
        } catch (error) {
            // console.error("Error in booking transport:", error);
            // toast.error("Failed to book transport. Please try again.");
        }
    }

    const handle_transport_pay_second_installment = async (transaction_id) => {
        const formData = new FormData();
        // formData.append("room_id", room_id);
        formData.append("booking_id", transport_booking_id);
        formData.append("user_id", transport_user_id);
        formData.append("transaction_id", transaction_id);
        formData.append("payment_method", "Online");
        formData.append("place", "transport_book");
        formData.append("amount", transport_second_installment);
        formData.append("status", "success");

        const token = User_Authentication();
        if (!token) {
            toast.error("User is not logged in.");
            return;
        }
        try {
            console.log("Calling transport_book API...");
            const response = await transport_pay_second_installment(formData, { Authorization: `Bearer ${token}` });

            console.log("API Response:", response);
            if (response?.data?.status == "200") {
                toast.success(response?.data?.message);
                setTimeout(() => {
                    navigate("/my_transport_booking");
                }, 1000);

                setTimeout(() => {
                    // localStorage.removeItem("room_id");
                    localStorage.removeItem("transport_booking_id");
                    localStorage.removeItem("transport_user_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("payment_method");
                    localStorage.removeItem("transport_second_installment");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("amount");
                    localStorage.removeItem("place");
                    localStorage.removeItem("booking_period");
                }, 5000);
                // setSelectedDurations("");
            } else if (response?.response?.data?.status == "500") {
                // toast.error(response?.response?.data?.message);
            }
        } catch (error) {
            // console.error("Error in booking transport:", error);
            // toast.error("Failed to book transport. Please try again.");
        }
    }

    useEffect(() => {
        if (orderId && !isBookingInitiated) {
            axios
                .get(`${BaseUrl}get-payment-status?order_id=${orderId}`)
                .then((response) => {
                    const paymentStatus = response.data.order_status;
                    setStatus(paymentStatus);

                    if (paymentStatus === "PAID") {
                        const transaction_id = response.data.cf_order_id;
                        setPaymentStatus("PAID");
                        setTransactionId(transaction_id);
                        localStorage.setItem("transaction_id", transaction_id);
                        handle_room_book_now(transaction_id);
                        handle_book_transport(transaction_id);
                        handle_room_pay_second_installment(transaction_id);
                        handle_transport_pay_second_installment(transaction_id);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching payment status:", error);
                    setStatus("failed");
                });
        }
    }, [orderId, setPaymentStatus, setTransactionId, isBookingInitiated]);

    return (
        <div>
            <h2>Payment Status: {status.toUpperCase()}</h2>
            <h4>Please wait for a while as the payment is being processed</h4>
        </div>
    );
};

export default Success_Payment;
