import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { cafe, shirt, fastFood, arrowBack } from 'ionicons/icons';

import './PlaceModal.scss';
import Axios from 'axios';
import constants from '../constants';

const usedIcons = {cafe, shirt, fastFood};

export default (props) => {
    const placePreview = props.place;

    const [isLoading, setIsLoading] = useState();
    const [place, setPlace] = useState();

    const fetchData = async() => {
        setIsLoading(true);

        let placeDetailRes = await Axios.get(`${ constants.API_BASE }/place_detail/${ placePreview.id }`);
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
                    <IonContent>
                        <h1>{ place.title }</h1>
                    </IonContent>
                : null
            }
        </IonModal>
    )
}