import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonLabel } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { cafe, shirt, fastFood } from 'ionicons/icons';

import './MapMarker.scss';

const usedIcons = {cafe, shirt, fastFood};

export default (props) => {
    const place = props.place;

    return (
        <div className={ `markerContainer ${ props.isActive ? 'active' : null }` }>
            <div className="marker" onClick={props.onClick}>
                <IonIcon icon={usedIcons[place.icon]} color="light" class="icon" />
            </div>

            <IonLabel class="label">{ place.name }</IonLabel>

            { props.isActive ? <IonButton class="showMoreButton" color="primary" fill="outline" size="small">Zobraziť</IonButton> : null }
        </div>
        // <IonCard style={{ height: '100px', width: '200px' }}>
        //     <IonCardHeader>
        //         <IonCardTitle>{ props.place.name }</IonCardTitle>
        //     </IonCardHeader>
        // </IonCard>
    )
}