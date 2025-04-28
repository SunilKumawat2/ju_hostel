import React from 'react';
import ReactDOM from 'react-dom/client';
// import './assets/img/favicon.ico'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { PaymentProvider } from './contexts/PaymentContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PaymentProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </PaymentProvider>
    
  </React.StrictMode>
);

