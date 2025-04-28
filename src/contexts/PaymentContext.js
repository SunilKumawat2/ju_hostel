import { createContext, useContext, useState } from "react";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [transactionId, setTransactionId] = useState(null);

    return (
        <PaymentContext.Provider value={{ paymentStatus, setPaymentStatus, transactionId, setTransactionId }}>
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
