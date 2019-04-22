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
    return (
      <div className="weather-panel">
        <span className="country">
          {data.name}, {data.sys.country}
          <img onClick={this.props.onMarkAsFavoriteClick} 
               src={this.props.isSelectedCityFavorite ? starYellowPath : starBlackPath}
               alt="Favorite"
               className="star-black"/>
        </span>
        {Math.round(data.main.temp)} C
      </div>
    )
  }
}