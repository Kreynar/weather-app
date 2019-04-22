import React, { Component } from 'react';
import './WeatherPanel.scss';

const starBlackPath =  process.env.PUBLIC_URL + '/assets/star-black.png';
const starYellowPath =  process.env.PUBLIC_URL + '/assets/star-yellow.png';

export default class Dialog extends Component {
  render() {
    const { data } = this.props;
    const weatherIconUrl = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    return (
      <div className="weather-panel">
        <h2>
          {data.name}, {data.sys.country}
          <img onClick={this.props.onMarkAsFavoriteClick} 
               src={this.props.isSelectedCityFavorite ? starYellowPath : starBlackPath}
               alt="Favorite"/>
        </h2>
        <img src={weatherIconUrl} className="weather-icon" alt="Weather"/>
        <h3>{Math.round(data.main.temp)}°</h3>
        <div className="weather-info">
          <div className="column">
            <div>Condition: {data.weather[0].main}</div>
            <div>Humidity: {data.main.humidity}%</div>
            <div>Pressure: {data.main.pressure} mb</div>
          </div>
          <div className="column">
            <div>Cloud: {data.clouds.all}%</div>
            <div>Wind: {data.wind.speed} m/s</div>
            <div>Visibility: {data.visibility / 1000} km</div>
          </div>
        </div>
      </div>
    )
  }
}