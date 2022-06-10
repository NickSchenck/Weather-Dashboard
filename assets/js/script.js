/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city */
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

var searchSection = document.querySelector("#search-section");
var searchCity = document.querySelector("#search-area");
var time = moment(new Date()).format("MM/DD/YYYY");
var historyClicked = document.querySelector("#search-history");

var formSubmitHandler = function (event) {
  event.preventDefault();
  var city = searchCity.value.trim();
  if (city === "") {
    alert("You must enter a valid city")
  }
  var citySave = document.createElement("button");
  citySave.classList.add("d-flex", "flex-column", "align-items-stretch", "border-0", "bg-secondary", "w-100", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  document.getElementById("search-history").appendChild(citySave);
  document.getElementById("city-searched").innerText = city + " " + time;
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=88492f617957986cb392da3e78550452&units=imperial")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
      
      getLatLon(data)
      // console.log(data);
    });

};

var getLatLon = function (data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    getWeather(lat, lon);
  //function to get coordinates
};

var getWeather = function (lat, lon) {
  //function to get weather
  //need to clean up api request to limit payload
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=88492f617957986cb392da3e78550452&units=imperial")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
      // console.log(data.current.uvi);
      displayWeather(data)
      console.log(data);
    });
}

var displayWeather = function (weather) {
  // console.log(data);
  document.getElementById("city-temp").innerText = "Temp: " + weather.current.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.current.wind_speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + weather.current.humidity + "%";
  document.getElementById("city-uv").innerText = "UV Index: " + weather.current.uvi;
  for(i = 0; i < 5; i++){
    if(i === 0){
      var date = new Date(weather.daily[0].dt).toLocaleDateString("en-US")
      document.getElementById("date1").innerHTML = date;
      document.getElementById("icon1").innerHTML = weather.daily[0].weather[0].icon;
      document.getElementById("temp1").innerText = "Temp: " + weather.daily[0].temp.day + "°F";
      document.getElementById("wind1").innerText = "Wind: " + weather.daily[0].wind_speed + "MPH";
      document.getElementById("humid1").innerText = "Humidity: " + weather.daily[0].humidity + "%";
    }
  }
  console.log(weather.daily[i].temp.day);
  //create for loop to iterate through the five day forecast
};

searchSection.addEventListener("submit", formSubmitHandler);
// historyClicked.addEventListener("click", displayWeather());
//API call on 47 isn't wanting to be put into an array like the one on 33
//Unsure how to populate appropriate fields when a history item is clicked
//unsure how to iterate the date in order to write to the 5-day forecast
//unsure of how to get info from the API which is a day or more ahead of current call, in order to write to 5-day forecast
