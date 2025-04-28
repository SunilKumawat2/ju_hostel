import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Images from '../../common/images/Images'
import Header from '../../common/header/Header'
import Footer from '../../common/footer/Footer'
import { newsList } from ".././../../api/Global"
import { ImageUrl } from '../../../config/Config'
import Loader from '../../../loader/Loader'
function NewsList() {
  const [isLoading, setIsLoading] = useState(false)
  const [latestnews, setLatestnews] = useState([])

  useEffect(() => {
    const fetchNewsList = async () => {
      setIsLoading(true)
      try {
        const response = await newsList();
        console.log(response);
        if (response?.data?.status == "200") {
          setLatestnews(response?.data?.data?.news)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)

      }
    }
    fetchNewsList()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div>
      <Header />
      <div className="top_space pt-115" />
      <div className="clear-fix" />
      {/*====== LATEST NEWS START ======*/}
      <section className="latest-news bg-white pt-70 pb-70">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12 text-center">
              <div className="section-title">
                <span className="title-tag">News</span>
                <h2>Our Latest News</h2>
              </div>
            </div>
          </div>
          {/* Latest post loop */}
          {
            isLoading ? <Loader /> :
              <div className="row mt-40">
                {latestnews?.map((news) => {
                  const formattedDate = new Date(news?.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });

                  return (
                    <div className="col-lg-4" key={news.id}>
                      <Link to={`/news_details/${news?.id}`}>
                        <div className="latest-post-box">
                          <div className="post-img " >
                            <img src={`${ImageUrl}${news?.image}`} alt='' style={{ width: "100%", height: "300px" }} />
                          </div>
                          <div className="post-desc">
                            <ul className="post-meta">
                              <li><Link to="#"><i className="fal fa-calendar-alt" /> {formattedDate}</Link></li>
                            </ul>
                            <h4 ><Link to={`/news_details/${news?.id}`} className="text-truncate-2">{news?.title}</Link></h4>
                            <p className="text-truncate-3 text-black">
                              <p>{news?.short_description}</p>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}



              </div>
          }
        </div>
      </section>
      {/*====== LATEST NEWS END ======*/}
      {/* our client */}
      {/* <div className="text-center">
        <img src={Images.client_logo} className="img-fluid" alt='' />
      </div> */}
      {/* our client end */}

      <Footer />
    </div>

  )
}

export default NewsList