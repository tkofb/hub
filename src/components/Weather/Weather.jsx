import "./Weather.css";
import locationIcon from "../../assets/location.svg";
import weatherIcon from "../../assets/weather.svg";
import { useRef, useState } from "react";
import { fetchWeatherApi } from "openmeteo";

const Weather = () => {
  const [currLat, setLat] = useState(null);
  const [currLon, setLon] = useState(null);
  const [currLocation, setCurrLocation] = useState(null)

  const getLonLatZip = async (zipCode) => {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&limit=1&format=json&addressdetails=1`;

    const response = await fetch(url);
    const data = (await response.json())[0];
    const { lat, lon } = data;

    console.log(data.address)

    await getWeather(lat, lon);
  };

  const getInfo = async (lon, lat) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lon}&lon=${lat}`
    console.log(url)
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)

  }

  const getWeather = async (lat, lon) => {
    const params = {
      longitude: lon,
      latitude: lat,
      current: ["temperature_2m", "relative_humidity_2m", "precipitation"],
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const response = responses[0];
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    // const timezone = response.timezone();
    // const timezoneAbbreviation = response.timezoneAbbreviation();
    // const latitude = response.latitude();
    // const longitude = response.longitude();

    const current = response.current();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0).value(),
        relativeHumidity2m: current.variables(1).value(),
        precipitation: current.variables(2).value(),
      },
    };

    setLat(lat);
    setLon(lon);
    console.log(weatherData);
  };

  const successCallback = async (position) => {

    const {latitude, longitude} = position.coords;
    await getWeather(latitude, longitude)
    await getInfo(latitude, longitude)
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  const handlePreciseLocation = () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submittedZipCode = zipCodeRef.current.value;

    getLonLatZip(submittedZipCode);

    zipCodeRef.current.value = "";
  };

  const zipCodeRef = useRef(null);

  return (
    <div className="weather">
      <div className="weatherInput">
        <img className="weatherIcon" src={weatherIcon} alt="locationIcon" />

        <form onSubmit={handleSubmit}>
          <label htmlFor="zipCode">
            Zip Code: &nbsp;
            <input id="zipCode" ref={zipCodeRef} type="text" />
          </label>
        </form>

        <img
          className="locationIcon"
          src={locationIcon}
          alt="locationIcon"
          onClick={handlePreciseLocation}
        />
      </div>
      <div className="weatherDisplay">
        {currLon}, {currLat}
      </div>
    </div>
  );
};

export default Weather;
