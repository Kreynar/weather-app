import React, { Component } from 'react';
import './LocationSelect.scss';

const deviceLocationPath = process.env.PUBLIC_URL + '/assets/current_location.png';
const starBlackPath = process.env.PUBLIC_URL + '/assets/star-black.png';

export default class Map extends Component {
  onFavoriteCitySelect = event => {
    this.props.onFavoriteCitySelect(this.props.favoriteCities[event.target.value].latLng);
  }

  render() {
    const { favoriteCities } = this.props;
    return (
      <div className="location-selection">
        <div onClick={this.props.onDeviceLocationSelect}
             className="column">
          <img src={deviceLocationPath} alt=""/>
          Current
        </div>
        <div className="column">
          <select onChange={this.onFavoriteCitySelect} value={-1}>
            <option hidden disabled value={-1}></option>
            {favoriteCities.length 
              ? favoriteCities.map((city, index) => 
                  <option value={index} 
                          key={city.name}>
                    {city.name}
                  </option>)
              : <option value={null} disabled={true}>No favorite cities added</option>
            }
          </select>
          <img src={starBlackPath} alt=""/>
          Favorites
        </div>
      </div>
    );
  }
}