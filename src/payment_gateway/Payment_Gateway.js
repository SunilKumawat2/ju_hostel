import React from "react";
import axios from "axios";
import { create_payment } from "../api/Booking";

const PaymentGateway = ({ Price, onPaymentSuccess }) => {
    const user_mobile = localStorage.getItem("mobile")
    const user_email = localStorage.getItem("email")
    console.log("object", user_email)
    const initiatePayment = async () => {
        console.log("initiatePayment started");

        if (!window.Cashfree) {
            console.error("Cashfree SDK is not loaded");
            alert("Payment system error. Please refresh the page.");
            return;
        }

        try {
            console.log("Calling create_payment API...");
            const { data } = await create_payment({
                amount: Price,
                email: user_email,
                mobile: user_mobile
            });

            console.log("API Response:", data);

            if (!data.payment_session_id || !data.order_id) {
                console.error("No payment_session_id or order_id received");
                alert("Payment failed: No session ID received.");
                return;
            }

            console.log("Initializing Cashfree...");
            const cashfree = new window.Cashfree({
                mode: "production", // Change to "production" when live
            });
            // https://hostel.jecrcuniversity.edu.in
            console.log("Calling cashfree.checkout()...");
            cashfree.checkout({
                paymentSessionId: data.payment_session_id,
                returnUrl: `https://hostel.jecrcuniversity.edu.in/payment-success?order_id=${data.order_id}`,
            });

        } catch (error) {
            console.error("Payment API Error:", error);

            if (error.response) {
                console.error("Server Response:", error.response.data);
                alert(`Payment request failed: ${error.response.data.message || "Unknown error"}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("Payment request failed: No response from server. Check your internet.");
            } else {
                console.error("Request Error:", error.message);
                alert(`Payment request failed: ${error.message}`);
            }
        }

        console.log("initiatePayment function completed");
    };

    return (
        <div className="col-md-6 paymentss">
            <button className="btn btn-danger js-btn-next p-2 px-4 mt-2 text-white w-100"
                onClick={initiatePayment}>
                {/* Pay ₹{Price} Now */}
                Pay Now
            </button>
        </div>

    );
};

export default PaymentGateway;
