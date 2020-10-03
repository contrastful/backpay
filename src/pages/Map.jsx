import React, { useEffect, useRef, useState } from 'react';
import { createGesture, IonActionSheet, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonLabel, IonLoading, IonPage, IonProgressBar, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@ionic-native/geolocation';
import './Map.scss';
import { checkmark, add, colorWandOutline, locationOutline, locationSharp, helpOutline } from 'ionicons/icons';
import GoogleMapReact from 'google-map-react';
import MapMarker from '../components/MapMarker';
import usedIcons from '../usedIcons';

import MapStyles from '../theme/MapStyle.json';
import PlaceModal from '../components/PlaceModal';
import TutorialModal from '../components/TutorialModal';
import Axios from 'axios';
import constants from '../constants';

const Map = () => {
  const mapRef = useRef();
  const [loading, setLoading] = useState();
  const [bottomCardsActive, setBottomCardsActive] = useState();
  const [categories, setCategories] = useState();
  const [places, setPlaces] = useState();
  const [activeCategory, setActiveCategory] = useState();
  const [activePlace, setActivePlace] = useState();
  const [placeDetailOpen, setPlaceDetailOpen] = useState();
  const [showingTutorial, setShowingTutorial] = useState();
  const [showingAreaActionSheet, setShowingAreaActionSheet] = useState();
  const [areas, setAreas] = useState();
  const [activeArea, setActiveArea] = useState();
  const [minZoomLevel, setMinZoomLevel] = useState();

  const bottomPlacesRef = useRef();

  const fetchData = async () => {
    setLoading(true);

    // setShowingTutorial(true);

    try {
      let categoriesRes = await Axios.get(`${ constants.API_BASE }/categories_and_areas`);
      setCategories(categoriesRes.data.categories);
      setAreas(categoriesRes.data.areas);
      setActiveArea(categoriesRes.data.areas[0]);

      loadArea(categoriesRes.data.areas[0]);

      // if (false) {
      //   Geolocation.getCurrentPosition().then(async position => {
      //     setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });

      //     setLoading(false);

      //     setTimeout(() => {
      //       mapRef.current.panTo({ lat: position.coords.latitude, lng: position.coords.longitude });
      //     }, 100);
      //   }).catch(e => {
      //     console.log(e);
      //     setLoading(false);
      //   });
      // }
    } catch (e) {
      console.log(e);
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

  const loadArea = async (area) => {
    setBottomCardsActive(false);
    setLoading(true);

    let placesRes = await Axios.get(`${ constants.API_BASE }/places?areaSlug=${ area.slug }`);
    setPlaces(placesRes.data.places);

    setActiveArea(area);
    setBottomCardsActive(true);
    setLoading(false);

    try {
      setMinZoomLevel(area.minZoomLevel);
      mapRef.current.panTo({ lat: area.latitude, lng: area.longitude });
      mapRef.current.setZoom(area.defaultZoomLevel);
      console.log('zoom: ' + area.defaultZoomLevel);
      console.log('min: ' + area.minZoomLevel);
    } catch (e) {
      console.log(e);
    }
  }

  const switchCategory = (category) => {
    if (category.id === activeCategory) {
      setActiveCategory(null);
    } else {
      setActiveCategory(category.id);
      setBottomCardsActive(true);
      setActivePlace(null);
      mapRef.current.setZoom(14);
    }
  }

  const switchPlace = (place, dontUnmark = false) => {
    if (!dontUnmark && (activePlace && activePlace.id === place.id)) {
      setActivePlace(null);
      mapRef.current.setZoom(14);
    } else {
      setBottomCardsActive(true);
      setActivePlace(place);
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
            Backpay
            {/* <div className="locationTitle">Bratislava</div> */}
          </IonTitle>

          <IonButtons slot="end">
            <IonButton color="light" onClick={() => setShowingAreaActionSheet(true) }>
              <span style={{ marginRight: '.5rem' }}>{ activeArea ? activeArea.name : null }</span> <IonIcon icon={locationOutline} />
            </IonButton>
            <IonButton color="light" size="small" onClick={() => setShowingTutorial(true) }>
              <IonIcon slot="icon-only" icon={helpOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>

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
      </IonHeader>

      <IonContent fullscreen class="content" scrollY={false}>
        <div className="mapSection">
          {/* { position ?  */}
            <GoogleMapReact
              options={{ zoomControl: false, fullscreenControl: false, styles: MapStyles, minZoom: minZoomLevel ? minZoomLevel : 10 }}
              bootstrapURLKeys={{ key: 'AIzaSyAVp64uakSkfvtzl28aqjPALKk_r3W9iR0' }}
              defaultCenter={{ lat: 48.1496395, lng: 17.1172203 }}
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
                ) : []
              }
            </GoogleMapReact>
          {/* : null } */}
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
                    <IonCardTitle>{ place.title } <IonIcon icon={usedIcons[place.icon]} color={placeIsActive(place) ? 'light' : 'primary'} size="medium" style={{ position: 'relative', top: '4px' }} /></IonCardTitle>
                    <IonCardSubtitle>{ place.subtitle }</IonCardSubtitle>
                  </IonCardHeader>
                </IonCard>

                {/* {
                  placeDetailOpen && placeDetailOpen.id === place.id ?
                  <PlaceModal place={place} isOpen={placeDetailOpen && placeDetailOpen.id === place.id} />
                  : null
                } */}
              </div>
            ) : null
          }
        </div>
      </IonContent>

      <PlaceModal place={placeDetailOpen} isOpen={placeDetailOpen ? true : false} onDismiss={() => setPlaceDetailOpen(null) } />

      <TutorialModal isOpen={ showingTutorial } onDismiss={ () => setShowingTutorial(false) } />

      <IonActionSheet
        isOpen={showingAreaActionSheet}
        onDidDismiss={() => setShowingAreaActionSheet(false)}
        header='Vyber si oblasť'
        buttons={
          [...(areas ? areas.map(area => {
            return {
              text: area.name,
              cssClass: (activeArea && activeArea.id === area.id) ? 'activeArea' : '',
              handler: () => {
                loadArea(area)
              }
            }
          }) : []), { text: 'Ďalšie miesta čoskoro!', cssClass: 'disabledArea' }]
        }
      >
      </IonActionSheet>
    </IonPage>
  );
};

export default Map;
