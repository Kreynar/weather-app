import React, { Component } from 'react';
import $script from 'scriptjs';
import './Map.scss';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.locationInputRef = React.createRef();
  }

  componentDidMount() {
    $script('https://maps.googleapis.com/maps/api/js?key=AIzaSyA86jpzAWU9lNSFrSaHqZr08soFyQCXeZA', () => {
      this.googleMaps = window.google.maps;
      this.map = new this.googleMaps.Map(document.getElementById('map'), {
        center: {lat: 55.169, lng: 23.881},
        zoom: 6
      });
      this.geocoder = new this.googleMaps.Geocoder();
      this.map.addListener('center_changed', () => this.fetchWeatherAndSetMarkersWithTimeout());
      this.map.addListener('zoom_changed', () => this.fetchWeatherAndSetMarkersWithTimeout());
      this.focusDeviceLocationAndSetMarkersWithTemperature();
    })
  }

  fetchWeatherAndSetMarkersWithTimeout = () => {
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.fetchCitiesWeatherInFocusedLocation()
        .then(citiesWeatherData => this.setMarkersWithTemperature(citiesWeatherData));
    }, 500)
  }

  focusDeviceLocationAndSetMarkersWithTemperature = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.focusLocationAndSetMarkersWithTemperature(null, { 
        lat: position.coords.latitude, 
        lng: position.coords.longitude
      })
    });
  }

  focusLocationAndSetMarkersWithTemperature = (locationName, locationLatLng) => {
    this.geocoder.geocode({ address: locationName, location: locationLatLng }, (results, status) => {
      if (status === this.googleMaps.GeocoderStatus.OK) { 
        this.map.setCenter(results[0].geometry.location);
        this.map.fitBounds(results[0].geometry.viewport);
        this.map.getZoom() > 8 ? this.map.setZoom(8) : this.map.setZoom(this.map.getZoom() + 1);
        this.fetchCitiesWeatherInFocusedLocation()
          .then(citiesWeatherData => this.setMarkersWithTemperature(citiesWeatherData));
      }
    });
  }

  fetchCitiesWeatherInFocusedLocation = () => {
    const zoom = this.map.getZoom() + 1;
    const west = this.map.getBounds().getSouthWest().lng(); 
    const south = this.map.getBounds().getSouthWest().lat();   
    const east = this.map.getBounds().getNorthEast().lng();
    const north = this.map.getBounds().getNorthEast().lat();   
    return fetch(`https://api.openweathermap.org/data/2.5/box/city?bbox=${west},${south},${east},${north},${zoom}&appid=98c355d73f22c6eb33c4bc0bd22031fe`)
      .then(response => response.json());
  }

  setMarkersWithTemperature = citiesWeatherData => {
    if (this.markers && this.markers.length) this.markers.forEach(marker => marker.setMap(null));
    try {
      this.markers = citiesWeatherData.list.map(cityWeatherData => {
        return new this.googleMaps.Marker({
          position: {
            lat: cityWeatherData.coord.Lat,
            lng: cityWeatherData.coord.Lon
          },
          label: Math.round(cityWeatherData.main.temp) + '',
          map: this.map
        });
      });
    } catch(err) {}
  }

  render() {
    return (
      <div>
        <label htmlFor="location">Search for weather in location: </label>
        <input onKeyUp={event => event.key === 'Enter' 
                          ? this.focusLocationAndSetMarkersWithTemperature(this.locationInputRef.current.value) 
                          : null}
          ref={this.locationInputRef}
          id="location" 
          type="text" 
          placeholder="Country / city"/>
        <button onClick={() => this.focusLocationAndSetMarkersWithTemperature(this.locationInputRef.current.value)}>
          Search
        </button>
        <div id="map"></div>
      </div>
    );
  }
}
