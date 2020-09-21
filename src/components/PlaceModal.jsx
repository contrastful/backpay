import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonLabel, IonModal } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { cafe, shirt, fastFood } from 'ionicons/icons';

import './PlaceModal.scss';

const usedIcons = {cafe, shirt, fastFood};

export default (props) => {
    const place = props.place;

    return (
        <IonModal isOpen={props.isOpen}>
            <p>{ place.name }</p>
        </IonModal>
    )
}