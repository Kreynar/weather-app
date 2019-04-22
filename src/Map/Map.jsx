import React, { Component } from 'react';
import $script from 'scriptjs';
import './Map.scss';
import { OPEN_WEATHER_MAP_API_KEY, GOOGLE_MAPS_API_KEY } from '../apiKeys.const';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.locationInputRef = React.createRef();
  }

  componentDidMount() {
    $script(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`, () => {
      this.googleMaps = window.google.maps;
      this.map = new this.googleMaps.Map(document.getElementById('map'), {
        center: {lat: 55.169, lng: 23.881},
        zoom: 6
      });
      this.geocoder = new this.googleMaps.Geocoder();
      this.map.addListener('center_changed', () => this.fetchWeatherAndSetMarkersWithTimeout());
      this.map.addListener('zoom_changed', () => this.fetchWeatherAndSetMarkersWithTimeout());
      this.focusDeviceLocationAndSetMarkers();
    })
  }

  fetchWeatherAndSetMarkersWithTimeout = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.fetchCitiesWeatherInFocusedLocation()
        .then(citiesWeatherData => this.setMarkers(citiesWeatherData));
    }, 500)
  }

  focusDeviceLocationAndSetMarkers = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.focusLocationAndSetMarkers(null, { 
        lat: position.coords.latitude, 
        lng: position.coords.longitude
      })
    });
  }

  focusLocationAndSetMarkers = (locationName, locationLatLng) => {
    this.geocoder.geocode({ address: locationName, location: locationLatLng }, (results, status) => {
      if (status === this.googleMaps.GeocoderStatus.OK) { 
        const { geometry } = results[0];
        this.map.setCenter(geometry.location);
        this.map.fitBounds(geometry.viewport);
        this.map.getZoom() > 8 ? this.map.setZoom(8) : this.map.setZoom(this.map.getZoom() + 1);
        this.props.onMapLocationFocus({ lat: geometry.location.lat(), lng: geometry.location.lng()});
        this.fetchCitiesWeatherInFocusedLocation()
          .then(citiesWeatherData => this.setMarkers(citiesWeatherData));
      }
    });
  }

  fetchCitiesWeatherInFocusedLocation = () => {
    const zoom = this.map.getZoom() + 1;
    const west = this.map.getBounds().getSouthWest().lng(); 
    const south = this.map.getBounds().getSouthWest().lat();   
    const east = this.map.getBounds().getNorthEast().lng();
    const north = this.map.getBounds().getNorthEast().lat();   
    return fetch(`https://api.openweathermap.org/data/2.5/box/city?units=metric&bbox=${west},${south},${east},${north},${zoom}&appid=${OPEN_WEATHER_MAP_API_KEY}`)
      .then(response => response.json());
  }

  setMarkers = citiesWeatherData => {
    if (this.markers && this.markers.length) this.markers.forEach(marker => marker.setMap(null));
    try {
      this.markers = citiesWeatherData.list.map(cityWeatherData => {
        const marker = new this.googleMaps.Marker({
          position: {
            lat: cityWeatherData.coord.Lat,
            lng: cityWeatherData.coord.Lon
          },
          label: Math.round(cityWeatherData.main.temp) + '',
          map: this.map
        });
        this.googleMaps.event.addListener(marker, 'click', () => {
          this.props.onMarkerClick({ lat: marker.position.lat(), lng: marker.position.lng() });
        });
        return marker;
      });
    } catch(err) {}
  }

  render() {
    return (
      <div className="map-panel">
        <div className="search">
          <input onKeyUp={event => event.key === 'Enter' 
                            ? this.focusLocationAndSetMarkers(this.locationInputRef.current.value) 
                            : null}
            ref={this.locationInputRef}
            id="location" 
            type="text" 
            placeholder="Search for country / city"/>
          <button onClick={() => this.focusLocationAndSetMarkers(this.locationInputRef.current.value)}>
            Search
          </button>
        </div>
        <div id="map"></div>
      </div>
    );
  }
}
