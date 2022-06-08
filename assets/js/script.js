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
var time = moment(new Date()).format("DD/MM/YYYY");
console.log(time);
// var cityLat =
// var cityLon =
//need to get city name from the search and plug it into the API call to get inital info


// var getWeather = function(){
//     fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + + "&lon=" + + "&exclude={part}&appid=88492f617957986cb392da3e78550452");
// }; 

var formSubmitHandler = function(event) {
    event.preventDefault();
    // console.log(event);
    var city = searchCity.value.trim();
    // console.log(city)
    if(city === ""){
      alert("You must enter a valid city")
    }
    var citySave = document.createElement("button")
    citySave.innerText = city;
    document.getElementById("search-history").appendChild(citySave);
    document.getElementById("city-searched").innerText = city + time;
    var getWeather = fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=88492f617957986cb392da3e78550452&units=metric").then(response => response.json())
    .then(data => console.log(data));
    Array.from(getWeather);
    // console.log(getWeather);
    document.getElementById("city-temp").innerText = "Temp:" + getWeather.main;
  };
var 

  searchSection.addEventListener("submit", formSubmitHandler);