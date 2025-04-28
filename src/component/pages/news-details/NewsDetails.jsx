import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Images from '../../common/images/Images'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { latestNewsDetails } from '../../../api/Global'
import { ImageUrl } from '../../../config/Config'
import Loader from '../../../loader/Loader'

const NewsDetails = () => {
  const { id } = useParams();
  const [isLoading,setIsLoading] = useState(false)
  const [get_news_details, set_Get_news_details] = useState({})

  // <---- show the news details here -------->
  useEffect(() => {
    const handle_get_news_details = async () => {
      setIsLoading(true)
      try {
        const response = await latestNewsDetails(id)
        if (response?.data?.status == "200") {
          set_Get_news_details(response?.data?.data?.news)
          setIsLoading(false)
        }
      }
      catch (error) {
        setIsLoading(false)
        console.log("error", error)
      }
    }
    handle_get_news_details()
  }, [])

  // <------- page go to on the top when we render on this page --------->
   useEffect(() => {
      window.scrollTo(0, 0)
    }, [])
  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      <div className="clear-fix" />
      {
        isLoading ? <Loader/> : 
      <section className="latest-news bg-white pb-70">
        <div className="container">
          <div className="row mt-40">
            <div className="col-lg-12">
              <div className="news-details-box">
                <div className="entry-content">
                  <h2 className="title">{get_news_details?.title}</h2>
                  <div className="post-img mb-4">
                    {
                      get_news_details?.image != null ? (
                        <img src={`${ImageUrl}${get_news_details?.image}`} width="100%"  className="img-fluid" alt='' />
                      ):(
                        <img src={Images.blog01} width="100%" className="img-fluid" alt='' />
                      )
                    }
                  </div>
                  <ul className="post-meta">
                    <li><Link to="#"><i className="fal fa-user" />by {get_news_details?.author_name}</Link></li>
                    <li><Link to="#"><i className="fal fa-calendar-alt" /> {new Date(get_news_details?.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true, 
                  })}</Link></li>
                  </ul>
                  <p className="mb-30">{get_news_details?.short_description}</p>
                  <p>{get_news_details?.long_description}</p>
                </div>
              </div>
            </div>
          </div>
        </div></section>
      }
      <Footer />
    </div>

  )
}

export default NewsDetails