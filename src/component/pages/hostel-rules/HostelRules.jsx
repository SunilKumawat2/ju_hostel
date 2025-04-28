import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { rulesRegulation } from "../../../api/Global"
import parse from 'html-react-parser';
import Loader from '../../../loader/Loader';

const HostelRules = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [rulesAndRegulation, setRulesAndRegulation] = useState(null)


  useEffect(() => {
    const fetchRulesAndRegulation = async () => {
      setIsLoading(true)
      try {
        const response = await rulesRegulation();
        console.log(response);
        if (response?.data?.status == "200") {
          setRulesAndRegulation(response?.data?.data?.rules_and_regulations)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
      }
    }
    fetchRulesAndRegulation()
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
            isLoading ? <Loader/> : 
            <>
              <div className="contact-info">
            <div className="row">
              <div className="col-md-12">
                <div className="section-title">
                  <h1>{rulesAndRegulation?.title}</h1>
                  <p>{parse(rulesAndRegulation?.description || "")}</p>
                </div>
              </div>
            </div>
          </div>
            </>
          }
        
        </div>
      </section>
      <Footer />
    </>
  )
}

export default HostelRules