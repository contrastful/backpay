import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonLabel } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import usedIcons from '../usedIcons';

import './MapMarker.scss';

export default (props) => {
    const place = props.place;

    return (
        <div className={ `markerContainer ${ props.isActive ? 'active' : null }` }>
            <div className="marker" onClick={props.onClick}>
                <IonIcon icon={usedIcons[place.icon]} color="light" class="icon" />
            </div>

            <IonLabel class="label">{ place.title }</IonLabel>

            { props.isActive ?
                <IonButton
                    class="showMoreButton"
                    color="primary"
                    fill="outline"
                    size="small"
                    onClick={ props.onShowDetailClick }
                >
                    Zobraziť
                </IonButton>
            : null }
        </div>
        // <IonCard style={{ height: '100px', width: '200px' }}>
        //     <IonCardHeader>
        //         <IonCardTitle>{ props.place.title }</IonCardTitle>
        //     </IonCardHeader>
        // </IonCard>
    )
}