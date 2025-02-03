import "./Weather.css";
import locationIcon from "../../assets/location.svg";
import weatherIcon from "../../assets/weather.svg"
import { useState } from "react";

const Weather = () => {

  const [currLat, setLat] = useState(null)
  const [currLon, setLon] = useState(null)


  const getLonLat = async (zipCode) => {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&limit=1&format=json`;
    
    const response = await fetch(url)
    const data = await response.json()
    const {lat, lon} = data[0]
    setLat(lat)
    setLon(lon)
  };

  return (
    <div className="weather">
      <img className="weatherIcon" src={weatherIcon} alt="locationIcon" />

      <form action="">
        <label htmlFor="zipCode">
          Zip Code: &nbsp;
          <input id="zipCode" type="text" />
        </label>
      </form>

      <img className="locationIcon" src={locationIcon} alt="locationIcon" />
    </div>
  );
};

export default Weather;
