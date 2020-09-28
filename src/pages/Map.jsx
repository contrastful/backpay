import React, { useEffect, useRef, useState } from 'react';
import { createGesture, IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@ionic-native/geolocation';
import './Map.scss';
import { cafe, shirt, fastFood, checkmark, add } from 'ionicons/icons';
import GoogleMapReact from 'google-map-react';
import MapMarker from '../components/MapMarker';

import MapStyles from '../theme/MapStyle.json';
import PlaceModal from '../components/PlaceModal';
import Axios from 'axios';
import constants from '../constants';

const usedIcons = {cafe, shirt, fastFood};

const Map = () => {
  const mapRef = useRef();
  const [loading, setLoading] = useState();
  const [position, setPosition] = useState();
  const [bottomCardsActive, setBottomCardsActive] = useState();
  const [categories, setCategories] = useState();
  const [places, setPlaces] = useState();
  const [activeCategory, setActiveCategory] = useState();
  const [activePlace, setActivePlace] = useState();
  const [currentZoom, setCurrentZoom] = useState();
  const [placeDetailOpen, setPlaceDetailOpen] = useState();

  const bottomPlacesRef = useRef();

  const fetchData = async () => {
    setCurrentZoom(14);

    setLoading(true);

    try {
      Geolocation.getCurrentPosition().then(async position => {
        setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });

        let categoriesRes = await Axios.get(`${ constants.API_BASE }/categories`);
        setCategories(categoriesRes.data.categories);

        let placesRes = await Axios.get(`${ constants.API_BASE }/places`);
        setPlaces(placesRes.data.places);

        setLoading(false);

        setBottomCardsActive(true);
      }).catch(e => {
        alert(JSON.stringify(e));
        setLoading(false);
      });
    } catch (e) {
      alert(JSON.stringify(e));
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();

    let c = bottomPlacesRef.current;
    const gesture = createGesture({
      el: c,
      gestureName: "my-swipe",
      direction: "y",
      onEnd: event => {
        if (event.deltaY > 10) {
          setBottomCardsActive(false);
          setActivePlace(null);
        }
      }
    });

    // enable the gesture for the item
    gesture.enable(true);
  }, []);

  const switchCategory = (category) => {
    if (category.id === activeCategory) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category.id);
      setBottomCardsActive(true);
      setActivePlace(null);
      setCurrentZoom(14);
      mapRef.current.setZoom(14);
    }
  }

  const switchPlace = (place, dontUnmark = false) => {
    if (!dontUnmark && (activePlace && activePlace.id === place.id)) {
      setActivePlace(null);
      setCurrentZoom(14);
      mapRef.current.setZoom(14);
    } else {
      setBottomCardsActive(true);
      setActivePlace(place);
      setCurrentZoom(17);
      setPosition({ lat: place.latitude, lng: place.longitude });
      mapRef.current.panTo({ lat: place.latitude, lng: place.longitude });
      mapRef.current.setZoom(17);

      var child = bottomPlacesRef.current.children.namedItem(`place_bottom_${place.id}`);
      
      bottomPlacesRef.current.scrollLeft = child.offsetLeft - 10;
    }
  }

  const placeIsActive = (place) => {
    return activePlace && activePlace.id === place.id;
  }

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
              {
                categories ? categories.map(category => 
                  <IonChip key={category.id} color="primary" outline={activeCategory !== category.id} onClick={() => switchCategory(category)}>
                    <IonIcon icon={usedIcons[category.icon]} color="primary" />
                    <IonLabel>{category.title}</IonLabel>
                    { activeCategory === category.id ? <IonIcon icon={checkmark} /> : null }
                  </IonChip>
                ) : <IonProgressBar type="indeterminate" />
              }
            </div>
          </IonToolbar>
        </IonHeader>

      <IonContent fullscreen class="content" scrollY={false}>
        <div className="mapSection">
          { position ? 
            <GoogleMapReact
              options={{ zoomControl: false, fullscreenControl: false, styles: MapStyles, minZoom: !activePlace ? 11 : 14 }}
              bootstrapURLKeys={{ key: 'AIzaSyAVp64uakSkfvtzl28aqjPALKk_r3W9iR0' }}
              defaultCenter={position}
              defaultZoom={14}
              yesIWantToUseGoogleMapApiInternals
              onGoogleApiLoaded={({ map, maps }) => mapRef.current = map }
            >
              {
                places ? places.filter(place => !activeCategory || activeCategory === place.categoryId).filter(place => !activePlace || activePlace.id === place.id).map(place => 
                  <MapMarker
                    key={place.id}
                    lat={place.latitude}
                    lng={place.longitude}
                    place={place}
                    isActive={placeIsActive(place)}
                    onClick={() => switchPlace(place, true)}
                    onShowDetailClick={() => setPlaceDetailOpen(place)}
                  />
                ) : null
              }
            </GoogleMapReact>
          : null }
        </div>

        <IonFab vertical="top" horizontal="end" slot="fixed">
          <IonFabButton color="light">
            <IonIcon icon={add} color="primary" />
          </IonFabButton>
        </IonFab>

        <div className="bottomScroll" ref={bottomPlacesRef} style={{ bottom: bottomCardsActive ? '-10px' : '-70px', opacity: bottomCardsActive ? 1 : 0.95 }} onTouchStart={ () => !bottomCardsActive ? setBottomCardsActive(true) : null }>
          {
            places ? places.filter(place => !activeCategory || activeCategory === place.categoryId).map(place =>
              <div key={place.id} className="cardContainer" id={`place_bottom_${place.id}`}>
                <IonCard className="card" key={place.id} color={placeIsActive(place) ? 'primary' : 'light'} onClick={() => switchPlace(place) }>
                  <IonCardHeader>
                    <IonCardTitle>{ place.title } <IonIcon icon={cafe} color={placeIsActive(place) ? 'light' : 'primary'} size="medium" style={{ position: 'relative', top: '4px' }} /></IonCardTitle>
                    <IonCardSubtitle>{ place.subtitle }</IonCardSubtitle>
                  </IonCardHeader>
                </IonCard>

                <PlaceModal place={place} isOpen={placeDetailOpen && placeDetailOpen.id === place.id} />
              </div>
            ) : null
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
