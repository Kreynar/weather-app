import React, { Component } from 'react';
import './LocationSelect.scss';

const deviceLocationPath = process.env.PUBLIC_URL + '/assets/current_location.png';
const starBlackPath = process.env.PUBLIC_URL + '/assets/star-black.png';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.locationInputRef = React.createRef();
  }

  render() {
    return (
      <div className="row">
        <div onClick={this.props.onDeviceLocationSelect}
             className="column">
          <img src={deviceLocationPath} className="current-location" alt=""/>
          Current
        </div>
        <div onClick={this.props.onFavoriteCitySelect}
             className="column">
          <img src={starBlackPath} className="star-black" alt=""/>
          Favorites
        </div>
      </div>
    );
  }
}