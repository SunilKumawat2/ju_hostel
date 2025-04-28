import React from 'react'
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import 'lightgallery/scss/lightgallery.scss';
import 'lightgallery/scss/lg-zoom.scss';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import { Link } from 'react-router-dom';
import { ImageUrl } from '../../../config/Config';

const Gallery = (props) => {
    const { galleries } = props
    const onInit = () => {

    };
    
    return (
        <LightGallery
            onInit={onInit}
            speed={500}
            plugins={[lgThumbnail, lgZoom]}
            elementClassNames='gallery-loop'
        >
            {galleries?.map((gallery) => (
                <Link to={`${ImageUrl}${gallery?.images?.image}`} data-aos="fade-up" className="popup-image single-gallery-image wow fadeInUp" data-aos-delay="300">
                    <img alt="img1" src={`${ImageUrl}${gallery?.images?.image}`} style={{ width: '100%' }} />
                </Link>
            ))}


        </LightGallery>

    )
}

export default Gallery