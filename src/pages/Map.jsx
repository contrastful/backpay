import React, { useEffect, useState } from 'react';
import { IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@ionic-native/geolocation';
import './Map.scss';
import { cafe, shirt, fastFood, checkmark } from 'ionicons/icons';
import GoogleMapReact from 'google-map-react';

const Map = () => {
  const [loading, setLoading] = useState();
  const [position, setPosition] = useState();


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
      <IonContent fullscreen class="content" scrollY={false}>
        <IonHeader class="header">
          <IonToolbar>
            <IonTitle size="large" class="title">Podniky okolo</IonTitle>

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

        <div className="mapSection">
          { position ? 
            <GoogleMapReact bootstrapURLKeys={{ key: 'AIzaSyAVp64uakSkfvtzl28aqjPALKk_r3W9iR0' }} defaultCenter={{ lat: 48, lng: 17}} center={position} defaultZoom={17}>
            </GoogleMapReact>
          : null }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
