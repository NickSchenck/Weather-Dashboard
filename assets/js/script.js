dayjs.extend(window.dayjs_plugin_utc);      //First two lines enable dayjs to iterate through dates in the five day forecast
dayjs.extend(window.dayjs_plugin_timezone);
let searchSection = document.querySelector("#search-section");
let searchCity = document.querySelector("#search-area");
let time = moment(new Date()).format("MM/DD/YYYY");     //This line uses moment.js to determine the current days date in the inital city display
let historyClicked = document.querySelector("#search-history");
let baseURL = "http://api.openweathermap.org/data/2.5/weather?";
let apiKey = "88492f617957986cb392da3e78550452";
let city = searchCity.value.trim();
//complete_url = base_url + "appid=" + api_key + "&q=" + city_name

let formSubmitHandler = function (event) {
  event.preventDefault();
       //Lines 9-13 prevent the page from reloading, get the value of the search box, and prevent the user from entering an empty response
  if (city === "") {
    alert("You must enter a valid city")
  }
  let citySave = document.createElement("button");
  citySave.classList.add("d-flex", "flex-column", "align-items-stretch", "border-0", "bg-secondary", "w-100", "text-center", "mt-2", "rounded");    //lines 14-17 display the searched city as a button
  citySave.innerText = city;
  document.getElementById("search-history").appendChild(citySave);
  document.getElementById("city-searched").innerText = city + " " + time;
  fetch(`${baseURL}appid=${apiKey}&q=${city}`)   //lines 18-26 display the city and date in inital results box and makes an API call using the cities name as a parameter
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getLatLon(data)
      console.log(data);
    });
};

/*We're going to need to look into tutorials on how to interact with the openweather API website. I think they may have changed how things
work on their end, and we will need to update accordingly.*/
let getLatLon = function (data) {
  let tz =  data.timezon;
  let lat = data.coord.lat;       //This function gets us our Timezone, and coordinates
  let lon = data.coord.lon;
  getWeather(lat, lon, tz);
};

let getWeather = function (lat, lon, tz) {
  fetch(`${baseURL}appid=${apiKey}&q=${city}`)  //this function uses coordinates as parameters for an API call to get weather data
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data, tz)
      // console.log(dayjs().tz(tz).add(1, "day").startOf("day").format("M/D/YYYY"))
    });
}

let displayWeather = function (weather, tz) {
  console.log(weather);
  document.getElementById("city-temp").innerText = "Temp: " + weather.current.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.current.wind_speed + "MPH";     //lines 48-51 display weather data in the inital results box
  document.getElementById("city-humid").innerText = "Humidity: " + weather.current.humidity + "%";
  document.getElementById("city-uv").innerText = "UV Index: " + weather.current.uvi;
  for(i = 0; i < 5; i++){
    let date = dayjs().tz(tz).add(i, "day").startOf("day").format("M/D/YYYY");
  document.getElementById("date" + (i + 1)).innerHTML = date;
  icon = weather.daily[(i + 1)].weather[0].icon;
  let iconEl = document.createElement("img");
  iconEl.src = 'http://openweathermap.org/img/wn/' + icon + '.png'        //This for loop iterates through the 5-day forecast, writing all applicable info to associated fields
  document.getElementById("icon" + (i + 1)).appendChild(iconEl);
  document.getElementById("temp" + (i + 1)).innerText = "Temp: " + weather.daily[i].temp.day + "°F";
  document.getElementById("wind" + (i + 1)).innerText = "Wind: " + weather.daily[i].wind_speed + "MPH";
  document.getElementById("humid" + (i + 1)).innerText = "Humidity: " + weather.daily[i].humidity + "%";
  }
};

searchSection.addEventListener("submit", formSubmitHandler);
historyClicked.addEventListener("click", displayWeather);