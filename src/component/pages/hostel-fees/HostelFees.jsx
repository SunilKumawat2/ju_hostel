import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { feesStructure } from "../../../api/Global";
import Loader from "../../../loader/Loader";
import ReactHtmlParser from 'react-html-parser';
const HostelFees = () => {
  const [isloading, setIsLoading] = useState(false)
  const [feeStructure, setFeeStructure] = useState({})
  console.log("feeStructure",feeStructure)

  useEffect(() => {
    const fetchFeesStructure = async () => {
      setIsLoading(true)
      try {

        const response = await feesStructure();
        console.log(response);
        if (response?.data?.status == "200") {
          setFeeStructure(response?.data?.data?.fee_structure)
          setIsLoading(false)
        }
      } catch (error) {
        // toast(error.message)
        setIsLoading(false)

      }
    }
    fetchFeesStructure()
  }, [])



  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      <div className="booking_section pb-115">
        {
          isloading ? <Loader/> : 
          <>
          <div className="container">
          <div className="row">
            <div className="col-md-12">
            <div>{ ReactHtmlParser(feeStructure?.description) }</div>
              {/* <div className="fee_table shadow p-3">
                <div className="table-responsive table_0">
                  {
                    isloading ? <Loader /> :
                      <table className="table border">
                        <thead>
                          <tr>
                            <th>Sr.No</th>
                            <th>Details</th>
                            <th>Fees Type</th>
                            <th>Charges (In Rs.)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feeStructure?.map((structure, key) => (
                            <tr key={key + 1}>
                              <td>{key + 1}</td>
                              <td>{structure?.detail}</td>
                              <td>{structure?.payment_type}</td>
                              <td>{structure?.
                                charges
                              }</td>
                            </tr>
                          ))}



                        </tbody>
                      </table>
                  }
                </div>
              </div> */}
            </div>
          </div>
        </div>
          </>
        }
        
      </div>
      <Footer />
    </div>

  )
}

export default HostelFees