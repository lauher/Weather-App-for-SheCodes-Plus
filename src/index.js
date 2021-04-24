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
    .querySelector("#icon-now")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#icon-now")
    .setAttribute("alt", response.data.weather[0].description);
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
}

function searchCity(city) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearch(event) {
  event.preventDefault();
  let searchedCity = document.querySelector("#city-input").value;
  searchCity(searchedCity);
}

function searchLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "538221d97e7453ab216f5f95980b0a93";
  let units = "metric";
  let apiUrl = `${apiEndpoint}?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
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

// Feature #1a: handleSearch - activated by searching for a city via the search form
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearch);

//Feature #1b: searchLocation - activated by searching via current location
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
