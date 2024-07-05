/*searchSection and forecastTimes are fairly simple variables, with event listeners attached to each of them.*/
let searchSection = document.getElementById("search-section");
let forecastTimes = document.querySelectorAll(".forecast-times");

/*fullForecastSection targets the entire container for our five day forecast, and is used to determine when its visible and which
bootsrap classes will be attached to it.*/
let fullForecastSection = document.getElementById("five-readout");

/*userSelection is a variable which targets the area where text and buttons which will be generated for a user to select the state their
city is in.*/
let userSelection = document.getElementById("user-selection");

/*historySection is a variable used to target the section where containers holding a previously searched city and a delete button will
be rendered.*/
let historySection = document.getElementById("search-history");

/*timeForForecast is a variable initialized to the string-value of 8. It is used to determine which time-values are selected for saving
 data to five day forecast, based on which time-of-day the user has selected to view in the five day forecast.*/
let timeForForecast = `8`;

/*baseURL and apiKey are both variables exclusively for interacting with API calls.*/
let baseURL = "http://api.openweathermap.org/data/2.5/";
let apiKey = "88492f617957986cb392da3e78550452";

/*allSearchedCities and globalData are both variables left at base-initialized status. allSearchedCities is an array that will contain
previously searched cities, and will have entries removed from it if the user clicks a cities delete button. globalData is a generic
variable which is set to a data-return from an API fetch; this information is saved globally to ensure it is properly read by our
determineFullForecast function.*/
let allSearchedCities = [];
let globalData;

/*formSubmitHandler is a function which submits our users city value. First, we initialize a variable of city to the trimmed(removes
whitespace from both ends of a value) value of a element with an Id of search-area. We preventDefault of the event of the form being
submitted(this just prevents a page-refresh, as that is default behavior on form-submission). We then enter an if statement where we
check if city is equal to an empty string, and if so we trigger an alert on our window object, then return out of the statement/function,
ensuring the rest of the function doesn't run. Otherwise, we initialize cityCell- which will create a div element, citySave- which will
create a button element, and deleteButton- which will also create a button element. Then, several classes(which translate to bootstrap)
are added to the citySave variable, and its innerText property is set to the city variable. The deleteButton variable also has classes
added to it, and has its innerText property set to the string `Del`. Continued below...*/
function formSubmitHandler() {
  let city = document.getElementById("search-area").value.trim();
  event.preventDefault();

  if (city === "") {
    alert("You must enter a valid city.")
    return;
  };
  let cityCell = document.createElement("div");
  let citySave = document.createElement("button");
  let deleteButton = document.createElement("button");
  citySave.classList.add("d-flex", "justify-content-center", "align-items-stretch", "w-75", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  deleteButton.classList.add("rounded", "delete-button");
  deleteButton.innerText = `Del`;
  
/*...Here, we enter an if statement, where we check if the variable city is included within the array-variable allSearchedCities, and if
this evaluates to truthy we call an alert on our window object. If city is NOT included in allSearchedCities, we push city to
allSearchedCities, append the cityCell variable(a div element) onto the historySection variable, and append both the deleteButton and
citySave variables(both button elements) onto the cityCell variable. Exiting out of the if/else, we call our getUserChoice function with
the argument of city. Continued below...*/
  if(allSearchedCities.includes(city)){
    window.alert(`City is already saved.`);
  }else{
    allSearchedCities.push(city);
    historySection.appendChild(cityCell);
    cityCell.appendChild(deleteButton);
    cityCell.appendChild(citySave);
  };
  getUserChoice(city);

  /*...Here, we add an event listener to our citySave variable, activated on a click and calling an annonymous, event driven function.
  We define the variable cityToSearch as the innerText property of whatever the target of our event is(what text of what is clicked),
  and call our getUserChoice function with an argument of cityToSearch passed in. Continued below...*/
  citySave.addEventListener("click", (event)=>{
    let cityToSearch = event.target.innerText;
    getUserChoice(cityToSearch);
  });
/*...Here, we add an event listener to our deleteButton varaiable, activated on a click and calling an annonymous, event driven function.
We define the variable parentElement as the parent element of whatever the target of our event is, and use the remove method on our
parentElement variable(which deletes the div containing the saved city, and its delete button). We also set allSearchedCities equal to
calling the filter method on allSearchedCities, where we enter an annonymous function that filters through allSearchedCities by the city
variable. Only the cities which DO NOT(!==) equal the innerText property of the second child(children[1]) of our parentElement variable
are returned(this ensures that the city deleted by the user is also removed from allSearchedCities array, which would allow the user to
search the city again, after deleting it)*/
  deleteButton.addEventListener("click", (event)=>{
    let parentElement = event.target.parentElement;
    parentElement.remove();
    allSearchedCities = allSearchedCities.filter((city) => city !== parentElement.children[1].innerText);
  });
};

function getUserChoice(city){
  userSelection.classList.remove("hide");

  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      console.log(data)
      data = data.filter((value, index, self) =>
        index === self.findIndex((i) => (
          i.state === value.state
      )));
      userSelection.innerText = `Which state is ${city} located in?`;
      
      data.forEach((entry) =>{
        let button = document.createElement("button");
        button.classList.add("available-states");
        button.innerText = entry.state;
        
        userSelection.appendChild(button);
      });

      for(let i = 0; i < userSelection.children.length; i++){
        userSelection.addEventListener("click", (event)=>{
        let chosenState = event.target.innerText;

        if(chosenState === data[i].state){
          getWeather(city, chosenState);
        };
        });
      };
    });
};

function getWeather(city, state){
  let time = moment(new Date()).format("MM/DD");
  let currentDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
  document.getElementById("city-searched").innerText = `${city}, ${state}, ${currentDay}, ${time}`;

  fetch(`${baseURL}weather?appid=${apiKey}&q=${state}&units=imperial`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayWeather(data);
      getFullForecast(data);
    });
};

function getFullForecast(weather){
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;

  fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      globalData = data;
      console.log(globalData)
      determineFullForecast();
    });
};

function determineFullForecast(){
  let fiveDayForecast = [];

  for(let i = 0; i < globalData.list.length; i++){
    if(globalData.list[i].dt_txt[12] === timeForForecast){
      fiveDayForecast.push(globalData.list[i]);
    };
  };
  displayFullForecast(fiveDayForecast);
};

function displayFullForecast(weather){
  fullForecastSection.classList.remove("hide");
  fullForecastSection.classList.add("d-flex", "flex-wrap");
  for(let i = 0; i < 5; i++){
    let dateConversion = new Date(weather[i].dt*1000);
    let day = dateConversion.toDateString().slice(0, 3);
    let date = weather[i].dt_txt.slice(5, 11);
    let icon = weather[i].weather[0].icon;
    document.getElementById("date" + (i + 1)).innerHTML = `${day}, ${date}`;
    document.getElementById("icon" + (i + 1)).src = `http://openweathermap.org/img/w/${icon}.png`;
    document.getElementById("temp" + (i + 1)).innerText = `Temp: ${weather[i].main.temp}°F`;
    document.getElementById("wind" + (i + 1)).innerText = `Wind: ${weather[i].wind.speed}MPH`;
    document.getElementById("humid" + (i + 1)).innerText = `Humidity: ${weather[i].main.humidity}%`;
  };
};

function displayWeather(weather) {
  let icon = weather.weather[0].icon;
  document.getElementById("main-icon").src = `http://openweathermap.org/img/w/${icon}.png`;
  document.getElementById("city-temp").innerText = "Temp: " + weather.main.temp + "°F";
  document.getElementById("city-wind").innerText = "Wind: " + weather.wind.speed + "MPH";
  document.getElementById("city-humid").innerText = "Humidity: " + weather.main.humidity + "%";
};

searchSection.addEventListener("submit", formSubmitHandler);

for(let i = 0; i < forecastTimes.length; i++){
  forecastTimes[i].addEventListener("click", (event)=>{
    let clickedTime = event.target.innerText;

    if(clickedTime === "Morning"){
      timeForForecast = `2`;
      determineFullForecast();
    }else if(clickedTime === "Afternoon"){
      timeForForecast = `8`;
      determineFullForecast();
    }else if(clickedTime === "Evening"){
      timeForForecast = `0`;
      determineFullForecast()
    }else if(clickedTime === "Night"){
      timeForForecast = `3`;
      determineFullForecast();
    };
  });
};

/*TODO:
  Likely some CSS touch-ups and changes
    -Will have to look at and refamiliarize myself with bootstrap, probably want to continue styling this app with it
    -considering combining the date and icon rows in 5-day forecast 
    -need to consider how the mobile versions of the app may render/look
 */