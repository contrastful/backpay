import React, { useEffect, useRef, useState } from 'react';
import { createGesture, IonAvatar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@ionic-native/geolocation';
import './Map.scss';
import { cafe, shirt, fastFood, checkmark, add } from 'ionicons/icons';
import GoogleMapReact from 'google-map-react';
import MapMarker from '../components/MapMarker';

import MapStyles from '../theme/MapStyle.json';

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

  const bottomPlacesRef = useRef();

  const fetchData = async () => {
    setCurrentZoom(14);

    setLoading(true);

    try {
      Geolocation.getCurrentPosition().then(position => {
        setLoading(false);
        setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });

        setCategories([
          {
            id: 1,
            name: 'Kaviarne',
            icon: 'cafe'
          },
          {
            id: 2,
            name: 'Slow fashion',
            icon: 'shirt'
          },
          {
            id: 3,
            name: 'Jedlo',
            icon: 'fastFood'
          }
        ]);

        setPlaces([
          {
            id: 1,
            name: 'Mad Drop',
            subtitle: 'Metalová kaviareň s posedením',
            category: 1,
            coordinates: {
              lat: 48.14667508062288,
              lng: 17.108716964721683
            },
            icon: 'cafe'
          },
          {
            id: 2,
            name: 'ArtCafe',
            subtitle: 'Galéria a kaviareň v jednom',
            category: 1,
            coordinates: {
              lat: 48.14667508062288,
              lng: 17.118716964721683
            },
            icon: 'cafe'
          },
          {
            id: 3,
            name: 'Jedlo',
            subtitle: 'Dake jedlo',
            category: 3,
            coordinates: {
              lat: 48.14667508062288,
              lng: 17.128716964721683
            },
            icon: 'fastFood'
          },
        ]);
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
      setPosition(place.coordinates);
      mapRef.current.panTo(place.coordinates);
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
                    <IonLabel>{category.name}</IonLabel>
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
                places ? places.filter(place => !activeCategory || activeCategory === place.category).filter(place => !activePlace || activePlace.id === place.id).map(place => 
                  <MapMarker
                    key={place.id}
                    lat={place.coordinates.lat}
                    lng={place.coordinates.lng}
                    place={place}
                    isActive={placeIsActive(place)}
                    onClick={() => switchPlace(place, true)}
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

        <div className="bottomScroll" ref={bottomPlacesRef} style={{ bottom: bottomCardsActive ? '55px' : '-10px', opacity: bottomCardsActive ? 1 : 0.95 }} onTouchStart={ () => !bottomCardsActive ? setBottomCardsActive(true) : null }>
          {
            places ? places.filter(place => !activeCategory || activeCategory === place.category).map(place =>
              <IonCard id={`place_bottom_${place.id}`} key={place.id} class="card" color={placeIsActive(place) ? 'primary' : 'light'} onClick={() => switchPlace(place) }>
                <IonCardHeader>
                  <IonCardTitle>{ place.name } <IonIcon icon={cafe} color={placeIsActive(place) ? 'light' : 'primary'} size="medium" style={{ position: 'relative', top: '4px' }} /></IonCardTitle>
                  <IonCardSubtitle>{ place.subtitle }</IonCardSubtitle>
                </IonCardHeader>
              </IonCard>
            ) : null
          }
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Map;
