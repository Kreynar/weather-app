import React, { Component } from 'react';
import './App.scss';
import Map from './Map/Map';
import LocationSelect from './LocationSelect/LocationSelect'
import WeatherPanel from './WeatherPanel/WeatherPanel';
import { OPEN_WEATHER_MAP_API_KEY } from './apiKeys.const';

const loadingGifPath =  process.env.PUBLIC_URL + '/assets/loading.gif';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      favoriteCities: []
    };
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.fetchWeatherInDeviceLocation();
    this.setState({
      favoriteCities: Object.values(localStorage)
        .map(cityStringified => JSON.parse(cityStringified))
    })
  }

  fetchWeatherInDeviceLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      this.fetchWeatherInSelectedLocation({ 
        lat: position.coords.latitude, 
        lng: position.coords.longitude
      })
    });
  }

  fetchWeatherInSelectedLocation = ({ lat, lng }) => {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lng}&appid=${OPEN_WEATHER_MAP_API_KEY}`)
      .then(response => response.json())
      .then(weatherData => this.setState({ weatherData, loaded: true }));
  }

  onDeviceLocationSelect = () => {
    this.fetchWeatherInDeviceLocation();
    this.mapRef.current.focusDeviceLocationAndSetMarkers()
  }

  onFavoriteCitySelect = latLng => {
    this.fetchWeatherInSelectedLocation(latLng);
    this.mapRef.current.focusLocationAndSetMarkers(null, latLng)
  }

  onMarkAsFavoriteClick = () => {
    this.setState(state => {
      const { favoriteCities } = state;
      const cityToBeAddedOrRemoved = {
        name: state.weatherData.name,
        latLng: {
          lat: state.weatherData.coord.lat,
          lng: state.weatherData.coord.lon
        } 
      }
      const isCityInFavorites = favoriteCities.some(city => city.name === cityToBeAddedOrRemoved.name);
      const newFavoriteCities =  isCityInFavorites
        ? favoriteCities.filter(city => city.name !== cityToBeAddedOrRemoved.name)
        : [...favoriteCities, cityToBeAddedOrRemoved];
      isCityInFavorites 
        ? localStorage.removeItem(cityToBeAddedOrRemoved.name)
        : localStorage.setItem(cityToBeAddedOrRemoved.name, JSON.stringify(cityToBeAddedOrRemoved));
      return { favoriteCities: newFavoriteCities };
    });
  }

  render() {
    const isSelectedCityFavorite = this.state.weatherData 
      ? this.state.favoriteCities.some(city => city.name === this.state.weatherData.name)
      : false;
    return (
      <div className="App">
        <LocationSelect onDeviceLocationSelect={this.onDeviceLocationSelect}
                        onFavoriteCitySelect={this.onFavoriteCitySelect}
                        favoriteCities={this.state.favoriteCities}/>
        {this.state.loaded 
          ? 
          <WeatherPanel onMarkAsFavoriteClick={this.onMarkAsFavoriteClick} 
                        data={this.state.weatherData} 
                        isSelectedCityFavorite={isSelectedCityFavorite}/>
          :
          <img src={loadingGifPath} className="loading" alt="Loading..."/>
        }
        <Map ref={this.mapRef} 
             onMarkerClick={this.fetchWeatherInSelectedLocation}
             onMapLocationFocus={this.fetchWeatherInSelectedLocation}/>
      </div>
    );
  }
}

export default App;
