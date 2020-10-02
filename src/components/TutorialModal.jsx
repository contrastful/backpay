import { IonModal, IonContent, IonSlide, IonIcon, IonSlides, IonButton } from '@ionic/react';
import { addCircle, addCircleOutline, arrowForwardOutline, arrowForwardSharp, heart, heartOutline, leafOutline, mapOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

import './TutorialModal.scss';

export default (props) => {
    const [showSlides, setShowSlides] = useState();

    useEffect(() => {
        setShowSlides(false);

        setTimeout(() => {
            setShowSlides(true);
        }, 300)
    }, [props.isOpen]);

    return (
        <IonModal isOpen={props.isOpen} swipeToClose={ true } onDidDismiss={ props.onDismiss }>
            <IonContent fullscreen>
                <div className="tutorial">
                    { showSlides ? 
                        <IonSlides>
                                <IonSlide className="slide">
                                    <IonIcon icon={ leafOutline } color="light" size="large" />

                                    <h2>Vitaj! O čo ide?</h2>
                                    <p>Slovensko je plné <b>kvalitných a ekologických</b> obchodov a podnikov, ktoré konkurujú globálnym značkám. Chceme preto vyrobiť appku, ktorá ti pomôže objaviť ich.</p>

                                    <div className="swipe">
                                        <p>1 / 3</p>
                                        <IonIcon icon={ arrowForwardSharp } color="light" size="medium" />
                                    </div>
                                </IonSlide>

                                <IonSlide className="slide">
                                    <IonIcon icon={ mapOutline } color="light" size="large" />

                                    <h2>Pridaj miesto</h2>
                                    <p>Backpay je <b>komunitná mapa</b>, kde zbierame super podniky z celého Slovenska. Ak poznáš miesto, ktoré by si chcel pridať, klikni na <IonIcon style={{ position: 'relative', top: '3px' }} icon={ addCircleOutline } color="light" size="small" /> ikonu vpravo hore mapy a čo najskôr ho pridáme.</p>

                                    <div className="swipe">
                                        <p>2 / 3</p>
                                        <IonIcon icon={ arrowForwardSharp } color="light" size="medium" />
                                    </div>
                                </IonSlide>

                                <IonSlide className="slide">
                                    <IonIcon icon={ heartOutline } color="light" size="large" />

                                    <h2>To je vlastne všetko.</h2>
                                    <p>Ak chceš sledovať novinky o udržateľnosti na Slovensku, môžeš nás sledovať na Instagrame. </p>

                                    <div className="swipe" style={{ marginTop: '1.3rem '}}>
                                        <IonButton fill="outline" color="light" onClick={ props.onDismiss }>Prejdi na mapu</IonButton>
                                    </div>
                                </IonSlide>
                            </IonSlides>
                    : null }
                </div>
            </IonContent>
        </IonModal>
    )
}