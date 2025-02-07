import "./Weather.css";
import locationIcon from "../../assets/location.svg";
import weatherIcon from "../../assets/weather.svg";
import { useRef, useState } from "react";
import { fetchWeatherApi } from "openmeteo";
import moment from "moment-timezone";
import { weatherCodeRep } from "./WeatherCodes";
import upArrowIcon from "../../assets/up.svg";
import downArrowIcon from "../../assets/down.svg";

const Weather = () => {
  const [currLat, setLat] = useState(null);
  const [currLon, setLon] = useState(null);
  const [currLocation, setCurrLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [currHour, setCurrHour] = useState(0);

  const getLonLatZip = async (zipCode) => {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&country=US&limit=1&format=json&addressdetails=1`;

    const response = await fetch(url);
    const data = (await response.json())[0];
    const { lat, lon } = data;

    setCurrLocation(data.address);

    await getWeather(lat, lon);
  };

  const getInfo = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const data = await response.json();

    setCurrLocation(data.address);

    await getWeather(lat, lon);
  };

  const getWeather = async (lat, lon) => {
    const params = {
      latitude: lat,
      longitude: lon,
      hourly: [
        "temperature_2m",
        "precipitation_probability",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
      ],
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "sunrise",
        "sunset",
        "uv_index_max",
      ],
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      forecast_days: 1,
      timezone: "auto",
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    const sunUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&tzid=${moment.tz.guess()}`;
    const sunResponse = await fetch(sunUrl);
    const sunData = await sunResponse.json();

    // Helper function to form time ranges
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    const daily = response.daily();
    const weatherData = {
      hourly: {
        time: range(
          Number(hourly.time()),
          Number(hourly.timeEnd()),
          hourly.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        precipitationProbability: hourly.variables(1).valuesArray(),
        weatherCode: hourly.variables(2).valuesArray(),
        windSpeed10m: hourly.variables(3).valuesArray(),
        windDirection10m: hourly.variables(4).valuesArray(),
      },

      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2mMax: daily.variables(0).valuesArray(),
        temperature2mMin: daily.variables(1).valuesArray(),
        uvIndexMax: daily.variables(4).valuesArray(),
      },
      sun: sunData.results,
    };

    setLat(lat);
    setLon(lon);
    setWeatherData(weatherData);
  };

  const successCallback = async (position) => {
    const { latitude, longitude } = position.coords;

    await getInfo(latitude, longitude);
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

  const returnWeatherData = () => {
    const hourly = weatherData.hourly
    const daily = weatherData.daily

    console.log(weatherData);
    const weatherCodeDetails =
      weatherCodeRep[hourly.weatherCode[currHour]]["day"];
    // console.log(weatherCodeDetails);

    return (
      <div className="weatherDisplay">
        <div className="tempAndConditions">
          <div className="temperature">
            <div className="location">
              {currLocation["city"]},{" "}
              {currLocation["ISO3166-2-lvl4"].split("-")[1]}
            </div>
            <div className="hourlyTemperature">
              {parseInt(hourly.temperature2m[currHour], 10)}
              <sup>&deg;F</sup>
            </div>
            <div className="maxAndMin">
              <div className="max">
                <img src={upArrowIcon} alt="up arrow icon" />
                {parseInt(daily.temperature2mMax[0], 10)}
              </div>
              <div className="min">
                <img src={downArrowIcon} alt="down arrow icon" />
                <div>{parseInt(daily.temperature2mMin[0], 10)}</div>
              </div>
            </div>
          </div>

          <div className="conditions">
            <div className="rainProbability">
              {parseInt(hourly.precipitationProbability[currHour], 10)}
            </div>
            <span>|</span>
            <div className="wind">
              Wind Direction: {parseInt(hourly.windDirection10m[currHour], 10)}
              Wind Speed: {parseInt(hourly.windSpeed10m[currHour], 10)}
            </div>
            <span>|</span>
            <div className="uvi">
              {parseInt(daily.uvIndexMax[currHour], 10)}
            </div>
          </div>
          {/* <div className="weatherConditions">
            <img src={weatherCodeDetails.image} alt="weatherCodeIcon" />
            <div className="weatherDescription">
              {weatherCodeDetails.description}
            </div>
          </div> */}
        </div>
      </div>
    );
  };

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
      {currLocation != null && weatherData != null ? (
        returnWeatherData()
      ) : (
        <div className="weatherDisplay"></div>
      )}
    </div>
  );
};

export default Weather;
