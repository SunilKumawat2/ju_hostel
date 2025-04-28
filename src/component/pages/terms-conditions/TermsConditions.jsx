import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { termsConditions } from "../../../api/Global"
import parse from 'html-react-parser';
import Loader from '../../../loader/Loader';
const TermsConditions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [terms, setTerms] = useState(null)

  useEffect(() => {
    const fetchTermsConditions = async () => {
      setIsLoading(true)
      try {
        const response = await termsConditions();
        console.log(response);
        if (response?.data?.status == "200") {
          setTerms(response?.data?.data?.terms)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchTermsConditions()
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <section className="contact-part pt-115 pb-115">
        <div className="container">
          {/* Contact Info */}
          {
            isLoading ? <Loader /> :
              <div className="contact-info">
                <div className="row">
                  <div className="col-md-12">
                    <div className="section-title">
                      <h1>{terms?.title}</h1>
                      <p>{parse(terms?.description || "")}</p>
                    </div>
                  </div>
                </div>
              </div>
          }
        </div>
      </section>
      <Footer />
    </>
  )
}

export default TermsConditions