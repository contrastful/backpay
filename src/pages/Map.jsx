import React, { useEffect, useState } from 'react';
import { IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@ionic-native/geolocation';
import './Map.scss';
import { cafe, shirt, fastFood, checkmark, filter, arrowUpCircle, arrowUp, caretUp, eyeOutline, add } from 'ionicons/icons';
import GoogleMapReact from 'google-map-react';

const Map = () => {
  const [loading, setLoading] = useState();
  const [position, setPosition] = useState();
  const [bottomCardsActive, setBottomCardsActive] = useState();

  const getLocation = async () => {
    setLoading(true);
      try {
          Geolocation.getCurrentPosition().then(position => {
            setLoading(false);
            setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
          }).catch(e => {
            alert(JSON.stringify(e));
            setLoading(false);
          })
      } catch (e) {
        alert(JSON.stringify(e));
        setLoading(false);
      }
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <IonPage>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message={'Načítavam...'}
      />
        <IonHeader class="header">
          <IonToolbar class="toolbar" color="primary">
            <IonTitle size="large" class="title">
              Podniky okolo
            </IonTitle>

            <div className="scroller">
              <IonChip color="primary">
                <IonIcon icon={cafe} color="primary" />
                <IonLabel>Kaviarne</IonLabel>
                <IonIcon icon={checkmark} />
              </IonChip>
              <IonChip color="primary" outline={true}>
                <IonIcon icon={shirt} color="primary" />
                <IonLabel>Slow fashion</IonLabel>
              </IonChip>
              <IonChip color="primary" outline={true}>
                <IonIcon icon={fastFood} color="primary" />
                <IonLabel>Jedlo</IonLabel>
              </IonChip>
            </div>
          </IonToolbar>
        </IonHeader>

      <IonContent fullscreen class="content" scrollY={false}>
        <div className="mapSection">
          { position ? 
            <GoogleMapReact options={{ zoomControl: false, fullscreenControl: false}} bootstrapURLKeys={{ key: 'AIzaSyAVp64uakSkfvtzl28aqjPALKk_r3W9iR0' }} defaultCenter={{ lat: 48, lng: 17}} center={position} defaultZoom={17}>
            </GoogleMapReact>
          : null }
        </div>

        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton color="light">
            <IonIcon icon={add} color="primary" />
          </IonFabButton>
        </IonFab>

        <div className="bottomScroll" style={{ bottom: bottomCardsActive ? '55px' : '-10px', opacity: bottomCardsActive ? 1 : 0.95 }} onTouchStart={ () => !bottomCardsActive ? setBottomCardsActive(true) : null }>
            <IonCard button={true} class="card" color="light">
              <IonCardHeader class="header">Test</IonCardHeader>
              <IonCardContent class="content">Boiii</IonCardContent>
            </IonCard>
            <IonCard button={true} class="card" color="light">
              <IonCardHeader class="header">Test</IonCardHeader>
              <IonCardContent class="content">Boiii</IonCardContent>
            </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
