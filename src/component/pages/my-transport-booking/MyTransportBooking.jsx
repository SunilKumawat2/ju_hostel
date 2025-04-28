import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import jsPDF from "jspdf";
import { User_Authentication } from '../../../user_authentication/User_Authentication';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { my_transport_bookings } from '../../../api/Booking';
import Loader from '../../../loader/Loader';
import { FaEye } from 'react-icons/fa';
import { Modal, Button, Table } from 'react-bootstrap';
import autoTable from "jspdf-autotable";
import Images from '../../common/images/Images';
import PaymentGateway from '../../../payment_gateway/Payment_Gateway';

const MyTransportBooking = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [my_transport_booking_list, set_My_Transport_Booking_List] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const user_name = localStorage.getItem("name")
  const user_email = localStorage.getItem("email")
  const mobile_name = localStorage.getItem("mobile")

  // <--------- fetch the my transport booking list ------------->
  useEffect(() => {
    const handle_My_Transport_Booking_List = async () => {
      setIsLoading(true)
      const token = User_Authentication();
      if (!token) {
        toast.error("user is not login here ");
      }
      try {
        const response = await my_transport_bookings({ Authorization: `Bearer ${token}` });
        if (response?.data?.status == "200") {
          set_My_Transport_Booking_List(response?.data?.data?.my_bookings)
          setIsLoading(false)
        }
        else {
          setIsLoading(false)
        }
      }
      catch (error) {
        setIsLoading(false)
      }
    }
    handle_My_Transport_Booking_List();
  }, [])

  // <--------- show the time in the simple formate ---------->
  const formatTimeToAMPM = (time) => {
    const [hour, minute] = time.split(':');
    let hours = parseInt(hour);
    const minutes = minute;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    const date = new Date(dateString).toLocaleDateString('en-GB', options);
    const time = new Date(dateString).toLocaleTimeString('en-GB');
    return `${date} ${time}`;
  };
  const second_formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };
  // <---------- show the invoice ------------>
  const handleShowInvoice = (booking) => {
    setActiveBooking(booking);
  };

  // <---------- Close the invoice ------------>
  const handleCloseInvoice = () => {
    setActiveBooking(null);
  };

  // <---------- when user render on the page then bydefault go to the top of the page --------->
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // <-------- generate the invoice into the pdf formated ----------->
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const logoUrl = `${Images?.JU_Hostel}`;
    const busImageUrl = "https://your-image-url.com/bus.png";

    const loadImage = (url) => {
      return new Promise((resolve) => {
        if (!url) {
          resolve(null);
          return;
        }

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };

        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          resolve(null);
        };
      });
    };

    Promise.all([loadImage(logoUrl), loadImage(busImageUrl)]).then(([logoBase64, busImageBase64]) => {
      //<----------- Add Logo (if available)
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 10, 5, 40, 10); // Adjust width & height
      }

      // Header Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Transport Booking Invoice", 60, 15);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Thank you for your booking!", 80, 22);

      // Transaction Information Table
      const bodyRows = [
        ["Name", user_name || "N/A"],
        ["Contact No", mobile_name || "N/A"],
        ["Email", user_email || "N/A"],
        ["First Installment Transaction ID", activeBooking?.payment_history[0]?.transaction_id || "N/A"],
        ["First Installment Payment Status", activeBooking?.payment_history[0]?.status || "N/A"],
        ["First Installment", `Rs. ${activeBooking?.boooking_detail?.amount || "0"}/-`],
        ["First Installment Payment Date", formatDate(activeBooking?.payment_history[0]?.created_at) || "N/A"],
        ["Total", `Rs. ${activeBooking?.boooking_detail?.amount || "0"}/-`],
      ];

      // ✅ Add this conditionally
      if (activeBooking?.boooking_detail?.secondInstallmentAmount == null) {
        bodyRows.push([
          "Second Installment Due Payment Date",
          second_formatDate(activeBooking?.room_payment?.second_installment_due_date) || "N/A",
        ]);
      }
      if (activeBooking?.payment_history[1]?.transaction_id != null) {
        bodyRows.push([
          "Second Installment Transaction ID",
          (activeBooking?.payment_history[1]?.transaction_id) || "N/A",
        ]);
      }
      if (activeBooking?.payment_history[1]?.status != null) {
        bodyRows.push([
          "Second Installment Payment Status:",
          activeBooking?.payment_history[1]?.status || "0",
        ])
      }
      if (activeBooking?.boooking_detail?.secondInstallmentAmount != null) {
        bodyRows.push([
          "Second Installment Date:",
          second_formatDate(activeBooking?.payment_history[1]?.created_at) || "N/A",
        ])
      }

      if (activeBooking?.room_payment?.secondInstallmentAmount != null) {
        bodyRows.push([
          "Second Installment",
          `Rs. ${activeBooking.room_payment.second_installment || 0}/-`,
        ]);
      }
      

      if (activeBooking?.boooking_detail?.secondInstallmentAmount != null) {
        bodyRows.push([
          "Second Installment:",
          activeBooking?.boooking_detail?.secondInstallmentAmount || "0",
        ])
      }
   
 // ✅ Calculate Total Price based on the available amounts
 const totalPrice =
 Number(activeBooking?.boooking_detail?.amount || 0) +
 Number(activeBooking?.boooking_detail?.secondInstallmentAmount || 0);

 bodyRows.push(["Total Price", `Rs. ${totalPrice} /-`]);
      // Transaction Information Table
      autoTable(doc, {
        startY: 30,
        head: [["Transaction Information", "Details"]],
        body: bodyRows,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2, halign: "left" },
        columnStyles: {
          0: { fontStyle: "bold", halign: "left" },
          1: { halign: "right" },
        },
      });


      // Bus Details Table
      // Build the body array dynamically
      const busDetailsBody = [];

      if (activeBooking?.boooking_detail?.bus_name)
        busDetailsBody.push(["Bus Name", activeBooking.boooking_detail.bus_name]);

      if (activeBooking?.boooking_detail?.bus_register_number)
        busDetailsBody.push(["Bus Register Number", activeBooking.boooking_detail.bus_register_number]);

      if (activeBooking?.boooking_detail?.bus_no)
        busDetailsBody.push(["Bus Number", activeBooking.boooking_detail.bus_no]);

      if (activeBooking?.boooking_detail?.driver_name)
        busDetailsBody.push(["Driver Name", activeBooking.boooking_detail.driver_name]);

      if (activeBooking?.boooking_detail?.driver_contact)
        busDetailsBody.push(["Driver No", activeBooking.boooking_detail.driver_contact]);

      if (activeBooking?.route_from)
        busDetailsBody.push(["Route From", activeBooking.route_from]);

      // Only render the table if there’s at least one valid field
      if (busDetailsBody.length > 0) {
        autoTable(doc, {
          startY: doc.lastAutoTable.finalY + 10,
          head: [["Bus Details", "Details"]],
          body: busDetailsBody,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 2, halign: "left" },
          columnStyles: {
            0: { fontStyle: "bold", halign: "left" },
            1: { halign: "right" },
          },
        });
      }



      // Add Bus Image Below the Table (if available)
      if (busImageBase64) {
        doc.addImage(busImageBase64, "PNG", 60, doc.lastAutoTable.finalY + 10, 80, 40);
      }

      // Save the PDF
      doc.save("invoice.pdf");
      console.log("PDF Generated Successfully!");
    }).catch(error => {
      console.error("Error Generating PDF:", error);
    });
  };

  const handlePaymentSuccess = (transactionId) => {
    console.log("🚀 Payment successful, calling room booking function...");
    // handle_room_book_now("success", "Online", transactionId);
  };

  return (
    <div>
      <Header compo="my_transport_booking" />
      <div className="top_space pt-115"></div>
      {/* <-------- ToastContainer ------------> */}
      <ToastContainer style={{ marginTop: "120px" }} />
      {
        isLoading ? <Loader /> :
          <>
            {
              my_transport_booking_list?.length > 0 ? (
                <div className="booking_section pb-115">
                  <div className="gi-register-wrapper container">
                    <div className="bg-white shadow rounded mt-3 p-4">
                      <h4 className="fw-semibold mb-3">Transport Booking List</h4>
                      <div className="table-responsive">
                        <table className="table table-bordered table-striped my_transportbooking">
                          <thead className="table-dark">
                            <tr>
                              <th>Bus Name</th>
                              <th>Bus Register Number</th>
                              <th>Bus Number</th>
                              <th>Driver Name</th>
                              <th>Driver No.</th>
                              <th>Departure</th>
                              <th>Departure Time</th>
                              <th>First Installment</th>
                              <th>Second Installment</th>
                              <th>Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {my_transport_booking_list?.map((my_transport_booking_list_result, index) => (
                              <tr key={index}>

                                <td>{my_transport_booking_list_result?.boooking_detail?.bus_name}</td>

                                <td>{my_transport_booking_list_result?.boooking_detail?.bus_register_number}</td>
                                <td>{my_transport_booking_list_result?.boooking_detail?.bus_no}</td>
                                <td>{my_transport_booking_list_result?.boooking_detail?.driver_name || "N/A"}</td>
                                <td>{my_transport_booking_list_result?.boooking_detail?.driver_contact}</td>
                                <td>{my_transport_booking_list_result?.route_from || "N/A"}</td>
                                <td>{my_transport_booking_list_result?.boooking_detail?.route_from_time ? formatTimeToAMPM(my_transport_booking_list_result?.boooking_detail.route_from_time) : "N/A"}</td>
                                <td className="text-danger fw-semibold">{
                                  my_transport_booking_list_result?.boooking_detail?.amount != null && (
                                    <div className='text-success'>
                                      {" "} ₹ {my_transport_booking_list_result?.boooking_detail?.amount}/-
                                    </div>
                                  )
                                }</td>
                                <td className="text-danger fw-bold" onClick={() => {
                                  localStorage.setItem("transport_booking_id", my_transport_booking_list_result?.boooking_detail?.booking_id);
                                  localStorage.setItem("transport_user_id", my_transport_booking_list_result?.boooking_detail?.user_id)
                                  localStorage.setItem("transport_second_installment", my_transport_booking_list_result?.route_detail?.second_installment)
                                }}>
                                  {
                                    my_transport_booking_list_result?.boooking_detail?.secondInstallmentAmount == null && (
                                      <PaymentGateway
                                        Price={my_transport_booking_list_result?.route_detail?.second_installment}
                                        onPaymentSuccess={handlePaymentSuccess}

                                      />
                                    )
                                  }
                                  <p>
                                    {
                                      my_transport_booking_list_result?.boooking_detail?.secondInstallmentAmount == null ? (
                                        <>
                                          {" "} ₹ {my_transport_booking_list_result?.route_detail?.second_installment}/-
                                        </>

                                      ) : (
                                        <div className='text-success'>
                                          {" "} ₹ {my_transport_booking_list_result?.route_detail?.second_installment}/-
                                        </div>
                                      )
                                    }
                                  </p>

                                </td>
                                <td><FaEye onClick={() => handleShowInvoice(my_transport_booking_list_result)} style={{ cursor: 'pointer' }} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className='text-danger mt-5 mb-5'>No transport is available at the moment.</p>
                </div>
              )
            }
          </>
      }
      {/*<------------- Invoice Modal --------------->*/}
      {activeBooking && (
        <Modal show={true} centered onHide={handleCloseInvoice} size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="invoice-content" className="p-3">
              <div className="text-center mb-4">
                <h4 className="fw-bold">Transport Booking Invoice</h4>
                <p className="text-muted">Thank you for your booking!</p>
              </div>

              {/*<---------------- Transaction Information ------------------>*/}
              <div className="table-responsive">
                <Table bordered className="mb-3">
                  <tbody>
                    <tr>
                      <td colSpan="2" className="text-center fw-bold bg-secondary text-white">
                        Transaction Information
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{user_name || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Contact No:</strong></td>
                      <td>{mobile_name || "N/A"}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{user_email || "N/A"}</td>
                    </tr>
                    {
                      activeBooking?.payment_history[0]?.transaction_id && (
                        <>
                          <tr>
                            <td><strong>First Installment Transaction ID:</strong></td>
                            <td>{activeBooking?.payment_history[0]?.transaction_id || "N/A"}</td>
                          </tr>
                        </>
                      )
                    }
                    {
                      activeBooking?.payment_history[1]?.transaction_id && (
                        <>
                          <tr>
                            <td><strong>Second Installment Transaction ID:</strong></td>
                            <td>{activeBooking?.payment_history[1]?.transaction_id || "N/A"}</td>
                          </tr>
                        </>
                      )
                    }
                    {
                      activeBooking?.payment_history && activeBooking?.payment_history[0] && (
                        <><tr>
                          <td><strong>First Installment Payment Status:</strong></td>
                          <td>{activeBooking?.payment_history[0]?.status || "N/A"}</td>
                        </tr>
                        </>
                      )
                    }
                    {
                      activeBooking?.payment_history && activeBooking?.payment_history[1] && (
                        <><tr>
                          <td><strong>Second Installment Payment Status:</strong></td>
                          <td>{activeBooking?.payment_history[1]?.status || "N/A"}</td>
                        </tr>
                        </>
                      )
                    }
                    <tr>
                      <td><strong>First Installment:</strong></td>
                      <td><strong>Rs. {activeBooking?.boooking_detail?.amount || "0"}/-</strong></td>
                    </tr>
                    {
                      activeBooking?.boooking_detail?.secondInstallmentAmount != null && (
                        <tr>
                          <td><strong>Second Installment:</strong></td>
                          <td><strong>Rs. {activeBooking?.boooking_detail?.secondInstallmentAmount || "0"}/-</strong></td>
                        </tr>
                      )
                    }

                    {/* {
                      activeBooking?.room_payment?.secondInstallmentAmount != null && (
                        <tr>
                          <td><strong>Second Installment:</strong></td>
                          <td><strong>Rs. {activeBooking?.room_payment?.second_installment || "0"}/-</strong></td>
                        </tr>
                      )
                    } */}
                    <tr>
                      <td><strong>First Installment Payment Date:</strong></td>
                      <td>{formatDate(activeBooking?.payment_history[0]?.created_at) || "N/A"}</td>
                    </tr>
                    {
                      activeBooking?.boooking_detail?.secondInstallmentAmount == null && (
                        <tr>
                          <td><strong>Second Installment Due Date:</strong></td>
                          <td>{second_formatDate(activeBooking?.route_detail?.second_installment_due_date) || "N/A"}</td>
                        </tr>
                      )
                    }

                    {
                      activeBooking?.boooking_detail?.secondInstallmentAmount != null && (
                        <tr>
                          <td><strong>Second Installment Date:</strong></td>
                          <td>{formatDate(activeBooking?.payment_history[1]?.created_at) || "N/A"}</td>
                        </tr>
                      )
                    }
                    <tr>
                      <td><strong>Total Price:</strong></td>
                      <td>
                        <strong>
                          Rs. {
                            (Number(activeBooking?.route_detail?.amount || 0) +
                              Number(activeBooking?.route_detail?.second_installment || 0))
                          }/-
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/*<----------- Bus & Route Details -------------->*/}
              <div className="table-responsive">
                <Table bordered>
                  <tbody>
                    <tr>
                      <td colSpan="2" className="text-center fw-bold bg-secondary text-white">
                        Bus & Route Details
                      </td>
                    </tr>
                    {
                      activeBooking?.boooking_detail?.bus_name != null && (
                        <tr>
                          <td><strong>Bus Name:</strong></td>
                          <td>{activeBooking?.boooking_detail?.bus_name || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.boooking_detail?.bus_register_number != null && (
                        <tr>
                          <td><strong>Bus Register Number:</strong></td>
                          <td>{activeBooking?.boooking_detail?.bus_register_number || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.boooking_detail?.bus_no != null && (
                        <tr>
                          <td><strong>Bus Number:</strong></td>
                          <td>{activeBooking?.boooking_detail?.bus_no || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.boooking_detail?.driver_name != null && (
                        <tr>
                          <td><strong>Driver Name:</strong></td>
                          <td>{activeBooking?.boooking_detail?.driver_name || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.boooking_detail?.driver_contact != null && (
                        <tr>
                          <td><strong>Driver Contact:</strong></td>
                          <td>{activeBooking?.boooking_detail?.driver_contact || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.route_from != null && (
                        <tr>
                          <td><strong>Departure:</strong></td>
                          <td>{activeBooking?.route_from || "N/A"}</td>
                        </tr>
                      )
                    }
                    {
                      activeBooking?.boooking_detail?.route_from_time != null && (
                        <tr>
                          <td><strong>Departure Time:</strong></td>
                          <td>
                            {activeBooking?.boooking_detail?.route_from_time
                              ? formatTimeToAMPM(activeBooking?.boooking_detail.route_from_time)
                              : "N/A"}
                          </td>
                        </tr>
                      )
                    }

                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseInvoice}>
              Close
            </Button>
            <Button variant="primary" onClick={generatePDF}>
              Download PDF
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Footer />
    </div>

  )
}

export default MyTransportBooking