import React, { Component } from 'react';
import './WeatherPanel.scss';

const starBlackPath =  process.env.PUBLIC_URL + '/assets/star-black.png';
const starYellowPath =  process.env.PUBLIC_URL + '/assets/star-yellow.png';

export default class Dialog extends Component {
  constructor(props) {
    super(props);
    console.log('@@', props)
  }
  render() {
    const { data } = this.props;
    const weatherIconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    console.log(this.props)
    return (
      <div className="weather-panel">
        <h1>
          {data.name}, {data.sys.country}
          <img onClick={this.props.onMarkAsFavoriteClick} 
               src={this.props.isSelectedCityFavorite ? starYellowPath : starBlackPath}
               alt="Favorite"/>
        </h1>
        <img src={weatherIconUrl} alt="Weather"/>
        <h2>{Math.round(data.main.temp)}°</h2>
        <div className="weather-info">
          <div className="column">
            <span className="row">Condition: {data.weather[0].main}</span>
            <span className="row">Humidity: {data.main.humidity}%</span>
            <span className="row">Pressure: {data.main.pressure} mb</span>
          </div>
          <div className="column">
            <span className="row">Cloud: {data.clouds.all}%</span>
            <span className="row">Wind: {data.wind.speed} m/s</span>
            <span className="row">Visibility: {data.visibility / 1000} km</span>
          </div>
        </div>
      </div>
    )
  }
}