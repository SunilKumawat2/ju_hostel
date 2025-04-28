import React, { useEffect, useState } from 'react'
import { notice } from '../../../api/Global';
import Header from '../../common/header/Header';
import Footer from '../../common/footer/Footer';
import Loader from '../../../loader/Loader';
import parse from 'html-react-parser';
const Notice = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [get_notice, set_Get_Notice] = useState([]);

    useEffect(() => {
        const Handle_Get_Notice = async () => {
            setIsLoading(true)
            try {
                const response = await notice();
                set_Get_Notice(response?.data?.data?.notice)
                setIsLoading(false)
            } catch (error) {
                console.log("error", error)
                setIsLoading(false)
            }
        }
        Handle_Get_Notice();
    }, [])
    console.log("get_notice", get_notice)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div>
            <Header />
            <section className="contact-part pt-115 pb-115">
                <div className="container">
                    {/* Contact Info */}
                    {
                        isLoading ? <Loader /> :
                            <>
                                <div className="contact-info">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="section-title">
                                                <h1>{get_notice[0]?.title}</h1>
                                                <p>{parse(get_notice[0]?.description || "")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }

                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Notice
