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

  onFavoriteCitySelect = () => {

  }

  onLocationInputSubmit = () => {

  }

  onMarkAsFavoriteClick = () => {
    this.setState(state => {
      const { favoriteCities } = state;
      const city = state.weatherData.name;
      let newFavoriteCities = []
      if (favoriteCities.includes(city)) {
        newFavoriteCities = this.getCitiesWithoutFavorite(favoriteCities, city);
      } else {
        newFavoriteCities = [...favoriteCities, city];
      }
      return { ...state, favoriteCities: newFavoriteCities};
    }, () => console.log(this.state));
  }

  getCitiesWithoutFavorite = (cities, city) => {
    const indexOfCity = cities.indexOf(city);
    return cities.slice(0, indexOfCity).concat(cities.slice(indexOfCity + 1));
  }

  render() {
    let isSelectedCityFavorite = this.state.weatherData 
      ? this.state.favoriteCities.includes(this.state.weatherData.name)
      : false;
    return (
      <div className="App">
        <LocationSelect onDeviceLocationSelect={this.onDeviceLocationSelect}
                        onFavoriteCitySelect={this.onFavoriteCitySelect}
                        onLocationInputSubmit={this.onLocationInputSubmit}/>
        {this.state.loaded 
          ? 
          <WeatherPanel onMarkAsFavoriteClick={this.onMarkAsFavoriteClick} 
                        data={this.state.weatherData} 
                        isSelectedCityFavorite={isSelectedCityFavorite}/>
          :
          <img src={loadingGifPath} className="loading" alt="Loading..."/>
        }
        <Map ref={this.mapRef} onMarkerClick={this.fetchWeatherInSelectedLocation}/>
      </div>
    );
  }
}

export default App;
