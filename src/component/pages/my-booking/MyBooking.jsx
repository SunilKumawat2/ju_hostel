import React, { useEffect, useState } from 'react';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import { my_room_bookings } from '../../../api/Booking';
import { User_Authentication } from '../../../user_authentication/User_Authentication';
import Loader from '../../../loader/Loader';
import { Modal, Button, Table } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Images from '../../common/images/Images';
import PaymentGateway from '../../../payment_gateway/Payment_Gateway';

const MyBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [myRoomBookingsList, setMyRoomBookingsList] = useState([]);
  const user_name = localStorage.getItem("name")
  const user_email = localStorage.getItem("email")
  const mobile_name = localStorage.getItem("mobile")
  const profile_image = localStorage.getItem("profile_image")
  const [showFullAddress, setShowFullAddress] = useState(false);

  useEffect(() => {
    const handleMyRoomBookingsList = async () => {
      setIsLoading(true);
      const token = User_Authentication();
      if (!token) {
        setIsLoading(false);
        // throw new Error('User token not found');
      }
      try {
        const response = await my_room_bookings({ Authorization: `Bearer ${token}` });
        if (response?.data?.status == "200") {
          setMyRoomBookingsList(response?.data?.data?.my_bookings);
          setIsLoading(false);
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false);
        console.log('error', error);
      }
    };
    handleMyRoomBookingsList();
  }, []);

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


  const toggleAddress = () => {
    setShowFullAddress(!showFullAddress);
  };

  const handleShowInvoice = (booking) => {
    setActiveBooking(booking);
  };

  const handleCloseInvoice = () => {
    setActiveBooking(null);
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])



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
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn(`Failed to load image: ${url}`);
          resolve(null);
        };
      });
    };

    Promise.all([loadImage(logoUrl), loadImage(busImageUrl)]).then(([logo, busImage]) => {
      // Add Logo (if available)
      if (logo) {
        doc.addImage(logo, "PNG", 10, 5, 40, 10);
      }

      // Header Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Hostel Booking Invoice", 70, 15);
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
        ["First Installment", `Rs. ${activeBooking?.room_payment?.room_price || "0"}/-`],
        ["First Installment Payment Date", formatDate(activeBooking?.payment_history[0]?.created_at) || "N/A"],
      ];

      // ✅ Add this conditionally
      if (activeBooking?.boooking_detail?.secondInstallmentAmount == null) {
        bodyRows.push([
          "Second Installment Due Payment Date",
          second_formatDate(activeBooking?.room_payment?.second_installment_due_date) || "N/A",
        ]);
      }
      if (activeBooking?.boooking_detail?.secondInstallmentAmount != null) {
        bodyRows.push([
          "Second Installment Date:",
          formatDate(activeBooking?.payment_history[1]?.created_at) || "N/A",
        ])
      }

      if (activeBooking?.room_payment?.secondInstallmentAmount != null) {
        bodyRows.push([
          "Second Installment:",
          formatDate(activeBooking?.room_payment?.second_installment) || "0",
        ])
      }

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


      // Hostel & Room Details Table
      const bodyData = [
        ["Hostel Name", activeBooking?.boooking_detail?.hostel_name || "N/A"],
        ["Block", activeBooking?.boooking_detail?.block_name || "N/A"],
        ["Floor", activeBooking?.boooking_detail?.floor_name || "N/A"],
        ["Room Number", activeBooking?.boooking_detail?.room_number || "N/A"],
        ["Room Size", activeBooking?.boooking_detail?.room_size || "N/A"],
        ["Hostel Address", activeBooking?.boooking_detail?.hostel_address || "N/A"],
        // ["First Installment", `Rs. ${Number(activeBooking?.boooking_detail?.amount || 0)} /-`],
      ];

      // ✅ Only add Second Installment if it exists
      if (activeBooking?.boooking_detail?.secondInstallmentAmount != null) {
        bodyData.push(["Second Installment", `Rs. ${Number(activeBooking?.boooking_detail?.secondInstallmentAmount)} /-`]);
      }

      // ✅ Calculate Total Price based on the available amounts
      const totalPrice =
        Number(activeBooking?.boooking_detail?.amount || 0) +
        Number(activeBooking?.boooking_detail?.secondInstallmentAmount || 0);

      bodyData.push(["Total Price", `Rs. ${totalPrice} /-`]);

      // ✅ Pass the modified `bodyData` into autoTable
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Hostel & Room Details", "Details"]],
        body: bodyData, // 👈 Use the updated array here
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2, halign: "left" },
        columnStyles: { 0: { fontStyle: "bold", halign: "left" }, 1: { halign: "right" } },
      });


      // Add Bus Image Below the Table (if available)
      if (busImage) {
        doc.addImage(busImage, "PNG", 60, doc.lastAutoTable.finalY + 10, 80, 40);
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
      <Header compo="mybooking" />
      <div className="top_space pt-115" />
      <div className="booking_section pb-115">
        <div className="gi-register-wrapper container-fluid">
          <h4 className="mb-3 fw-semibold">My Hostel Booking Room</h4>
          <div className="bg-white shadow rounded">
            <div className="p-4 py-3 border-bottom">
              <div className="row"></div>
            </div>
            {isLoading ? (
              <Loader />
            ) : (
              <div className="p-4">
                <div className="row">
                  {myRoomBookingsList?.length > 0 ? (
                    <div className="col-md-12">
                      <div className="table-responsive">
                        <table className="table table-bordered my_transportbooking">
                          <thead className="table-dark">
                            <tr>
                              <th>Hostel Name</th>
                              <th>Block</th>
                              <th>Floor</th>
                              <th>Room No.</th>
                              <th>Room Size.</th>
                              <th>First Installment</th>
                              <th>Second Installment</th>
                              <th>Hostel Address</th>
                              <th>Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myRoomBookingsList?.map((booking) => (
                              <tr key={booking?.id}>
                                <td>{booking?.boooking_detail?.hostel_name}</td>
                                <td>{booking?.boooking_detail?.block_name}</td>
                                <td>{booking?.boooking_detail?.floor_name}</td>
                                <td>{booking?.boooking_detail?.room_number}</td>
                                <td>{booking?.boooking_detail?.room_size}</td>
                                <td className="text-danger fw-bold">
                                  {
                                    booking?.boooking_detail?.amount != null && (
                                      <div className='text-success'>
                                        {" "} ₹ {booking?.boooking_detail?.amount}/-
                                      </div>
                                    )
                                  }
                                </td>
                                <td className="text-danger fw-bold" onClick={() => {
                                  localStorage.setItem("booking_id", booking?.boooking_detail?.booking_id);
                                  localStorage.setItem("user_id", booking?.boooking_detail?.user_id)
                                  localStorage.setItem("second_installment", booking?.room_payment?.second_installment)
                                }}>
                                  {
                                    booking?.boooking_detail?.secondInstallmentAmount == null && (
                                      <PaymentGateway
                                        Price={booking?.room_payment?.second_installment}
                                        onPaymentSuccess={handlePaymentSuccess}

                                      />
                                    )
                                  }
                                  {
                                    booking?.boooking_detail?.secondInstallmentAmount == null ? (
                                      <>
                                        {" "} ₹ {booking?.room_payment?.second_installment}/-
                                      </>

                                    ) : (
                                      <div className='text-success'>
                                        {" "} ₹ {booking?.room_payment?.second_installment}/-
                                      </div>
                                    )
                                  }
                                </td>


                                <td style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {showFullAddress ? booking?.boooking_detail?.hostel_address : booking?.boooking_detail?.hostel_address?.slice(0, 50) + "..."}
                                  {booking?.boooking_detail?.hostel_address?.length > 50 && (
                                    <button onClick={toggleAddress} style={{ border: "none", background: "none", color: "blue", cursor: "pointer" }}>
                                      {showFullAddress ? "View Less" : "View More"}
                                    </button>
                                  )}
                                </td>
                                <td>
                                  <FaEye
                                    onClick={() => handleShowInvoice(booking)}
                                    style={{ cursor: 'pointer' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className='text-danger mt-5 mb-5'>No room bookings are available at this time.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*<------------- Invoice Modal -----------------> */}
      {activeBooking && (
        <Modal show={true} centered onHide={handleCloseInvoice} size='lg'>
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div id="invoice-content" className="p-3">
              {/*<----------- Header - Invoice Title ------------>*/}
              <div className="text-center mb-4">
                <h4 className="fw-bold">Hostel Booking Invoice</h4>
                <p className="text-muted">Thank you for your booking!</p>
              </div>

              {/* Transaction Information */}
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
                    activeBooking?.transaction_id && activeBooking?.transaction_id[0] && (
                      <>
                        <tr>
                          <td><strong>First Installment Transaction ID:</strong></td>
                          <td>{activeBooking?.payment_history[0]?.transaction_id || "N/A"}</td>
                        </tr>
                      </>
                    )
                  }

                  {
                    activeBooking?.transaction_id && activeBooking?.transaction_id[1] && (
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
                    <td><strong>Rs. {activeBooking?.room_payment?.room_price || "0"}/-</strong></td>
                  </tr>
                  {
                    activeBooking?.room_payment?.secondInstallmentAmount != null && (
                      <tr>
                        <td><strong>Second Installment:</strong></td>
                        <td><strong>Rs. {activeBooking?.room_payment?.second_installment || "0"}/-</strong></td>
                      </tr>
                    )
                  }
                  {
                    activeBooking?.payment_history && activeBooking?.payment_history[0]?.created_at && (
                      <tr>
                        <td><strong>First Installment Payment Date:</strong></td>
                        <td>{formatDate(activeBooking?.payment_history[0]?.created_at) || "N/A"}</td>
                      </tr>
                    )
                  }

                  {
                    activeBooking?.boooking_detail?.secondInstallmentAmount == null && (
                      <tr>
                        <td><strong>Second Installment Due Date:</strong></td>
                        <td>{second_formatDate(activeBooking?.room_payment?.second_installment_due_date) || "N/A"}</td>
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
                </tbody>
              </Table>

              {/* Hostel & Room Details */}
              <Table bordered>
                <tbody>
                  <tr>
                    <td colSpan="2" className="text-center fw-bold bg-secondary text-white">
                      Hostel & Room Details
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Hostel Name:</strong></td>
                    <td>{activeBooking?.boooking_detail?.hostel_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Block:</strong></td>
                    <td>{activeBooking?.boooking_detail?.block_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Floor:</strong></td>
                    <td>{activeBooking?.boooking_detail?.floor_name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Room Number:</strong></td>
                    <td>{activeBooking?.boooking_detail?.room_number || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Room Size:</strong></td>
                    <td>{activeBooking?.boooking_detail?.room_size || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Hostel Address : </strong></td>
                    <td>{activeBooking?.boooking_detail?.hostel_address || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Total Price:</strong></td>
                    <td>
                      <strong>
                        Rs. {
                          (Number(activeBooking?.boooking_detail?.amount || 0) +
                            Number(activeBooking?.boooking_detail?.secondInstallmentAmount || 0))
                        }/-
                      </strong>
                    </td>
                  </tr>

                </tbody>
              </Table>
            </div>
          </Modal.Body>

          {/*<--------- Footer with Actions ------------->*/}
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
  );
};

export default MyBooking;
