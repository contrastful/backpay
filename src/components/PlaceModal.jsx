import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonModal, IonSegment, IonSegmentButton, IonSlide, IonSlides, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { arrowBack, logoInstagram, logoFacebook, logoGoogle, heart } from 'ionicons/icons';

import './PlaceModal.scss';
import Axios from 'axios';
import constants from '../constants';

import usedIcons from '../usedIcons';

const slideOpts = {
    initialSlide: 1,
    speed: 400
};

export default (props) => {
    const placePreview = props.place;

    const [isLoading, setIsLoading] = useState();
    const [place, setPlace] = useState();
    const [activeSegment, setActiveSegment] = useState();
    const [coverImage, setCoverImage] = useState();

    const fetchData = async() => {
        setPlace(null);
        setCoverImage(null);
        setActiveSegment('about');

        setIsLoading(true);

        let placeDetailRes = await Axios.get(`${ constants.API_BASE }/place_detail/${ placePreview.id }`);

        if (placeDetailRes.data.place.coverImage) {
            let coverImageBase64 = await Axios
                .get(placeDetailRes.data.place.coverImage, { responseType: 'arraybuffer' })
                .then(response => Buffer.from(response.data, 'binary').toString('base64'));

            setCoverImage(coverImageBase64);
        }
        
        setPlace(placeDetailRes.data.place);
        setIsLoading(false);
    }

    useEffect(() => {
        if (placePreview)
            fetchData();
    }, [props.isOpen]);

    return (
        <IonModal isOpen={props.isOpen} swipeToClose={ true } onDidDismiss={ props.onDismiss }>
            <IonLoading
                isOpen={isLoading}
                message={'Načítavam...'}
            />

            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={ props.onDismiss }>
                            <IonIcon slot="icon-only" icon={ arrowBack } />
                        </IonButton>
                    </IonButtons>

                    <IonTitle>{ place ? place.title : null }</IonTitle>
                </IonToolbar>
            </IonHeader>

            {
                place ?
                    <IonContent fullscreen className="placeModal">
                        <div className="header" style={{ background: 'rgba(45,211,111,1)', backgroundImage: coverImage ? `url(data:image/jpg;base64,${ coverImage })` : null, backgroundSize: 'cover' }}>
                            <div className="overlay"></div>

                            <h1>{ place.title }</h1>
                            <h4>{ place.subtitle }</h4>

                            <div className="social">
                                {
                                    place.googleMaps ?
                                        <IonChip outline className="socialMediaChip" onClick={ () => window.open(place.googleMaps, '_blank') }>
                                            <IonIcon color="light" icon={ logoGoogle } />
                                            <IonLabel color="light">Google Maps</IonLabel>
                                        </IonChip>
                                    : null
                                }

                                {
                                    place.instagram ?
                                        <IonChip outline className="socialMediaChip" onClick={ () => window.open(place.instagram, '_blank') }>
                                            <IonIcon color="light" icon={ logoInstagram } />
                                            <IonLabel color="light">Instagram</IonLabel>
                                        </IonChip>
                                    : null
                                }

                                {
                                    place.facebook ?
                                        <IonChip outline className="socialMediaChip" onClick={ () => window.open(place.facebook, '_blank') }>
                                            <IonIcon color="light" icon={ logoFacebook } />
                                            <IonLabel color="light">Facebook</IonLabel>
                                        </IonChip>
                                    : null
                                }
                            </div>
                        </div>

                        <div className="content">
                            { place.images.length > 0 ?
                                <div className="container">
                                    <IonSegment onIonChange={e => setActiveSegment(e.detail.value)} value={ activeSegment }>
                                        <IonSegmentButton value="about" defaultChecked>
                                            <IonLabel>Prečo { place.title }?</IonLabel>
                                        </IonSegmentButton>
                                        <IonSegmentButton value="gallery">
                                            <IonLabel>Galéria</IonLabel>
                                        </IonSegmentButton>
                                    </IonSegment>
                                </div>
                            : null }

                            {
                                activeSegment === 'about' ? 
                                    <div className="container about">
                                        <p>{ place.about }</p>

                                        {
                                            place.perks ?
                                                <div className="perks">
                                                    {
                                                        place.perks.map(perk =>
                                                            <div className="perk" key={ perk.id }>
                                                                <div className="icon">
                                                                    <IonIcon size="large" color="white" icon={ usedIcons[perk.icon] } />
                                                                </div>
                                                                <div className="label">
                                                                    <IonLabel color="white">{ perk.description }</IonLabel>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            : null
                                        }
                                    </div>
                                : activeSegment === 'gallery' ?
                                    <div className="gallerySlider">
                                        <IonSlides pager={true} options={slideOpts}>
                                            {
                                                place.images.map(image =>
                                                    <IonSlide key={ image.id }>
                                                        <img src={ image.source } />
                                                    </IonSlide>
                                                )
                                            }
                                        </IonSlides>

                                        {/* <p>Swajpuj</p> */}
                                    </div>
                                : null
                            }
                        </div>
                    </IonContent>
                : null
            }
        </IonModal>
    )
}