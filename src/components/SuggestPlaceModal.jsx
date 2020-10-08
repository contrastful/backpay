import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonModal, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { arrowBack } from 'ionicons/icons';

import './SuggestPlaceModal.scss';
import Axios from 'axios';
import constants from '../constants';

export default (props) => {
    const [suggestion, setSuggestion] = useState();
    const [isLoading, setIsLoading] = useState();
    const [isFinished, setIsFinished] = useState();

    useEffect(() => {
        setSuggestion({});
    }, [props.isOpen]);

    return (
        <IonModal isOpen={props.isOpen} swipeToClose={ true } onDidDismiss={ props.onDismiss }>
            { suggestion ?
                <div>
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

                            <IonTitle>Pridaj miesto</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    {
                        !isFinished ?
                            <IonContent fullscreen className="suggestPlaceModal">
                                <div className="content">
                                    <div className="container">
                                        <h1 style={{ marginBottom: '2rem' }}>Pridaj miesto na mapu</h1>

                                        {/* <IonList> */}
                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Názov miesta</IonLabel>
                                                <IonInput className="input" color="light" value={suggestion.title} onIonChange={ (event) => setSuggestion({ ...suggestion, title: event.target.value }) }></IonInput>
                                            </IonItem>

                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Kde sa nachádza? (adresa/súradnice)</IonLabel>
                                                <IonInput className="input" color="light" value={suggestion.suggestionAddress} onIonChange={ (event) => setSuggestion({ ...suggestion, suggestionAddress: event.target.value }) }></IonInput>
                                            </IonItem>

                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Výstižný popis pár slovami</IonLabel>
                                                <IonInput className="input" color="light" value={suggestion.subtitle} onIonChange={ (event) => setSuggestion({ ...suggestion, subtitle: event.target.value }) }></IonInput>
                                            </IonItem>

                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Čo sa ti na ňom páči?</IonLabel>
                                                <IonTextarea className="input light" color="light" value={suggestion.suggestionPerks} onIonChange={ (event) => setSuggestion({ ...suggestion, suggestionPerks: event.target.value }) }></IonTextarea>
                                            </IonItem>

                                            <h4>Dobrovoľné</h4>

                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Chceš k nemu pridať pár viet?</IonLabel>
                                                <IonTextarea className="input light" color="light" value={suggestion.about} onIonChange={ (event) => setSuggestion({ ...suggestion, about: event.target.value }) }></IonTextarea>
                                            </IonItem>

                                            <IonItem color="primary">
                                                <IonLabel color="light" position="floating">Chceš pridať svoje meno? :)</IonLabel>
                                                <IonInput className="input" color="light" value={suggestion.suggestionName} onIonChange={ (event) => setSuggestion({ ...suggestion, suggestionName: event.target.value }) }></IonInput>
                                            </IonItem>
                                        {/* </IonList> */}
                                    </div>
                                </div>
                            </IonContent>
                        :
                            <IonContent fullscreen className="suggestPlaceModal">
                                <div className="content">
                                    yay
                                </div>
                            </IonContent>
                    }
                </div>
            : null }
        </IonModal>
    )
}