import React, { useEffect, useState } from 'react'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import {privacyPolicy} from "../../../api/Global"
import parse from 'html-react-parser';
import Loader from '../../../loader/Loader';


const PrivacyPolicy = () => {
  const [isLoading,setIsLoading] = useState(false)
  const[privacyPolicies, setPrivacyPolicies]=useState(null)
   useEffect(()=>{
      const fetchPrivacyPolicy=async()=>{
        setIsLoading(true)
        try{
          
          const response=await privacyPolicy();
          console.log(response);
          if(response?.data?.status == "200"){
            setPrivacyPolicies(response?.data?.data?.policy)
            setIsLoading(false)
            
          }
        }catch(error){
        setIsLoading(false)
        // toast(error.message)
      }
    }
    fetchPrivacyPolicy()
  },[])
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <>
    <Header/>
   <section className="contact-part pt-115 pb-115">
  <div className="container">
    {/* Contact Info */}
    {
      isLoading ? <Loader/> : 
    <div className="contact-info">
      <div className="row">
        <div className="col-md-12">
          <div className="section-title">
            <h1>{privacyPolicies?.title}</h1>
            <p>{parse(privacyPolicies?.description || "")}</p>
          </div>
        </div>
      </div>
    </div>
    }
  </div>
</section>
<Footer/>
</>
  )
}

export default PrivacyPolicy