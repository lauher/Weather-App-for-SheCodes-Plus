function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];

  let currentHours = date.getHours();
  if (currentHours < 10) {
    currentHours = `0${currentHours}`;
  }

  let currentMinutes = date.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0${currentMinutes}`;
  }

  return `${currentDay} ${currentHours}:${currentMinutes}`;
}

function formatWeekday(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function formatHour(timestamp) {
  let date = new Date(timestamp * 1000);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  return hour;
}

function updateForecast(response) {
  let forecastHours = response.data.hourly;
  let forecastHoursElement = document.querySelector("#forecast-hours");

  let forecastHoursHTML = `<div class="row">`;

  forecastHours.forEach(function (forecastHour, index) {
    if (index === 3 || index === 6 || index === 9) {
      forecastHoursHTML =
        forecastHoursHTML +
        `
      <div class="col">
        <h2>${formatHour(forecastHour.dt)}:00</h2>
        <img 
          src ="http://openweathermap.org/img/wn/${
            forecastHour.weather[0].icon
          }@2x.png" 
          class= "icon"
          alt="Icon forecast ${forecastHour.weather[0].description}"/>
        <ul>
          <li>${forecastHour.weather[0].description}</li>
          <li>
            <span class="temperatures-max">${Math.round(
              forecastHour.temp
            )}° </span>
          </li>
        </ul>
      </div>
`;
    }
  });
  forecastHoursElement.innerHTML = forecastHoursHTML + "</div>";

  let forecastDays = response.data.daily;
  let forecastDaysElement = document.querySelector("#forecast-days");

  let forecastDaysHTML = "";

  forecastDays.forEach(function (forecastDay, index) {
    if (index < 3) {
      forecastDaysHTML =
        forecastDaysHTML +
        `<div class="card">
    <div class="card-body">   
      <h2>${formatWeekday(forecastDay.dt)}</h2>
      <img src ="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png"
      class = "icon"
      alt="Icon forecast ${forecastDay.weather[0].description}"/>
      <ul>
        <li>${forecastDay.weather[0].description}</li>
        <li>
          <span class="temperatures-max">${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="temperatures-min">${Math.round(
            forecastDay.temp.min
          )}°</span>
        </li>
      </ul>
    </div>
  </div>
  `;
    }
  });
  forecastDaysElement.innerHTML = forecastDaysHTML;
}

function getCoordinates(coordinates) {
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateForecast);
}

function updateWeather(response) {
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  document.querySelector("#time").innerHTML = formatDate(
    response.data.dt * 1000
  );
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document
    .querySelector(".icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector(".icon")
    .setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  getCoordinates(response.data.coord);
}

function searchCity(city) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
  console.log(apiUrl);
}

function handleSearch(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-input").value;
  searchCity(searchedCity);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function switchFahrenheit(event) {
  event.preventDefault();
  document.querySelector("#label-fahr").classList.add("active");
  document.querySelector("#label-cels").classList.remove("active");
  let fahrenheitTemperature = celsiusTemperature * (9 / 5) + 32;
  document.querySelector("#temperature").innerHTML = Math.round(
    fahrenheitTemperature
  );
  document.querySelector("#unit").innerHTML = "°F";
  document.querySelector(
    "#disclaimer"
  ).innerHTML = `<i class="fas fa-exclamation"></i> The conversion feature is currently only supported for the current temperature`;
}

function switchCelsius(event) {
  event.preventDefault();
  document.querySelector("#label-cels").classList.add("active");
  document.querySelector("#label-fahr").classList.remove("active");

  document.querySelector("#temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#unit").innerHTML = "°C";
}

// Feature #1a: update all app-parameters by searching for a city via the search form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearch);

//Feature #1b: update all app-parameters based upon current location
let locationSearch = document.querySelector("#current-location");
locationSearch.addEventListener("click", getCurrentLocation);

// Feature #2: switchTemperature
let fahrenheitButton = document.querySelector("#btn-unit-F");
fahrenheitButton.addEventListener("click", switchFahrenheit);

let celsiusButton = document.querySelector("#btn-unit-C");
celsiusButton.addEventListener("click", switchCelsius);

let celsiusTemperature = null;

//default searchvalue
searchCity("Zürich");
