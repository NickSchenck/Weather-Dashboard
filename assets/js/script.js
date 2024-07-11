/*searchSection and forecastTimes are fairly simple variables, with event listeners attached to each of them.*/
let searchSection = document.getElementById("search-section");
let forecastTimes = document.querySelectorAll(".forecast-times");

/*fullForecastSection targets the entire container for our five day forecast, and is used to determine when its visible and which
bootsrap classes will be attached to it. mainCityDisplay targets the main weather-card, and is used to determine when its visible.*/
let fullForecastSection = document.getElementById("five-readout");
let mainCityDisplay = document.getElementById("city-readout");

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
  let city = document.getElementById("search-area").value.trim();//Could set delete button icon in this function to an actual icon
  event.preventDefault();

  if (city === "") {
    alert("You must enter a valid city.")
    return;
  };
  let cityCell = document.createElement("div");
  let citySave = document.createElement("button");
  let svg = document.createElement("svg");
  let path1 = document.createElement("path");
  let path2 =document.createElement("path");
  let deleteButton = document.createElement("button");
  citySave.classList.add("d-flex", "justify-content-center", "align-items-stretch", "w-75", "text-center", "mt-2", "rounded");
  citySave.innerText = city;
  deleteButton.classList.add("rounded", "delete-button");
  svg.xmlns = "http://www.w3.org/2000/svg";
  svg.width = "16"
  svg.height = "16"
  svg.fill = "currentColor"
  svg.classList.add("bi", "bi-trash")
  svg.viewBox = "0 0 16 16"
  deleteButton.appendChild(svg);
  path1.d = "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
  path2.d = "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
  svg.append(path1, path2);
  // deleteButton.innerText = "Del";
  /*<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg> */
/*...Here, we enter an if statement, where we check if the variable city is included within the array-variable allSearchedCities, and if
this evaluates to truthy we call an alert on our window object. If city is NOT included in allSearchedCities, we push city to
allSearchedCities, append the cityCell variable(a div element) onto the historySection variable, and append both the deleteButton and
citySave variables(both button elements) onto the cityCell variable. Exiting out of the if/else, we call our getUserChoice function with
the argument of city. Continued below...*/
  if(allSearchedCities.includes(city)){
    window.alert(`City has already been searched, and is saved.`);
  }else{
    allSearchedCities.push(city);
    historySection.appendChild(cityCell);
    cityCell.appendChild(deleteButton);
    cityCell.appendChild(citySave);
  };
  getUserChoice(city);

  /*...Here, we add an event listener to our citySave variable, activated on a click and calling an annonymous, event driven function.
  We define the variable cityToSearch as the innerText property of whatever the target of our event is(the text of what is clicked),
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

/*getUserChoice is a function which alters the API call, depending on which state the user wanted weather from. We first initialize div
as a variable which creates a div element, and remove a class of hide from our userSelection variable, making the element visible. We
then enter into a fetch call, which is invoked with a URL string- containing template literals- to request data from a particular source.
We append the .then method onto our fetch call, using an anonymous function to return our response object as json data, and append a
second .then method which also invokes a anonymous function to manipulate our data object. Here, we set data equal to calling a filter
method on itself- which will ensure there are no duplicate entries within the array that data contains. Then, we set the innerText
property of our userSelection variable to a string containing a template literal and append a div onto our userSelection variable.
Continued below...*/
function getUserChoice(city){
  let div = document.createElement("div");
  userSelection.classList.remove("hide");

  fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      data = data.filter((value, index, self) =>
        index === self.findIndex((i) => (
          i.state === value.state
      )));
      userSelection.innerText = `Which state is ${city} located in?`;
      userSelection.appendChild(div);
      /*...Here, we call the forEach method on our data object. For each entry within data, we create a button element with our button
      variable, add a class of available-states to our button variable, set the innerText property of button to entry.state, and use
      the appendChild method to append our button variable onto our div variable(This creates all the states from which the
      user can choose to indentify their city with). Continued below...*/
      data.forEach((entry) =>{
        let button = document.createElement("button");
        button.classList.add("available-states");
        button.innerText = entry.state;
        
        div.appendChild(button);
      });

      /*...Here, we enter a for loop. We initialize the variable i as zero, test if i is LESS THAN the length property of all children of
      our div variable(how many children the div has), and iterate i if it is less than that number. Within the for loop, we add an event
      listener onto userSelection, where a click will activate an anonymous, event-driven function. We initialize the variable
      chosenState as the innerText property of the target of our event(text of what city was clicked), then enter an if statement. In
      the if statement, we check to see if our chosenState variable is equal to the state property of data at an index, and if so we call
      the getWeather function with the arguments of city and chosenState.*/
      for(let i = 0; i < div.children.length; i++){
        userSelection.addEventListener("click", (event)=>{
        let chosenState = event.target.innerText;

          if(chosenState === data[i].state){
            getWeather(city, chosenState);
          };
        });
      };
    });
};

/*getWeather is a function which uses its parameters to make another API call for more information. First, we initialize the variables
time and currentDay, which use the Date class to give us dates/time that are easily understood. We then select an element with the id of
city-searched and change its innerText property to a string comprised of four template literals; city, state, currentDay, and time(This
gives us our time readout on the main forecast card). We invoke another fetch call to the API, still with a URL string containing
template literals, append a .then method to use an anonymous function for returning our response object in json format, and append a
final .then method, which uses an anonymous function to pass our data object as an argument to the function calls of displayWeather and
getFullForecast.*/
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

/*getFullForecast is a function which uses its parameter to make another API call, specifically for our 5-day forecast's information.
First, we initialize the variables lat and lon as the lat and lon properties on the coord property of our weather object. We then invoke
another fetch call to the API, with a URL string containing template literals- including the lat and lon variables, so the search can
specifically target an areas weather. We append a .then method to use an anonymous function for returning our response object in json
format, and append an additional .then method, which first sets the globalData variable equal to our data object, then calls our
determineFullForecast function.*/
function getFullForecast(weather){
  let lat = weather.coord.lat;
  let lon = weather.coord.lon;

  fetch(`${baseURL}forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      globalData = data;
      determineFullForecast();
    });
};

/*determineFullForecast is a function which selects a set of data within globalData- via a time, and packages the data entries which match
that time into an array for displaying that data. We first initialize the variable fiveDayForecast as an empty array. Then, we enter a
for loop, where we initialize the variable i as zero, check if i is LESS THAN the length of the list property of globalData, and iterate
i if so. In the for loop, we enter an if statement, where we check to see if the dt_txt value at an index of 12, within the list property
at an index, in our globalData object is equal to the variable timeForForecast(This is evaluating if a character matches another
character, in this case a specific digit in a time). If these values are matching, we use the .push method to save list at an index-
within our globalData variable, to the fiveDayForecast array-variable. Outside of the if statement and for loop, we then call the
displayFullForecast function with an argument of the fiveDayForecast variable.*/
function determineFullForecast(){
  let fiveDayForecast = [];

  for(let i = 0; i < globalData.list.length; i++){
    if(globalData.list[i].dt_txt[12] === timeForForecast){
      fiveDayForecast.push(globalData.list[i]);
    };
  };
  displayFullForecast(fiveDayForecast);
};

/*displayFullForecast is a function which uses the parameter passed to it to display the 5-day forecast relavent to the users search,
even as the user alters or searches a new city. We start by removing a class of hide and adding bootstrap classes to our
fullForecastSection variable. Then we enter a for loop, initializing the variable i as 0, checking if i is LESS THAN 5, and iterating i
if so. We initialize dateConversion as a Date class-instance of the dt property multiplied by 1000- within the weather object at an
index(This is one method of converting a computer-timestamp into human-readable date/time formats). Then, initialize the variable day as
calling the .slice method on dateConversion after its been evaluated into a string by the .toDateString method(giving us the day). We
initialize the variable date as calling the .slice method on the dt_txt property, within our weather object at an index(this gives us
the MM - DD format). Then, we initialize a final variable of icon, set to the icon property within the weather property at its first
index, within the weather object at an index. Continued below...*/
function displayFullForecast(weather){
  fullForecastSection.classList.remove("hide");
  fullForecastSection.classList.add("d-flex", "flex-wrap");
  for(let i = 0; i < 5; i++){
    let dateConversion = new Date(weather[i].dt*1000);
    let day = dateConversion.toDateString().slice(0, 3);
    let date = weather[i].dt_txt.slice(5, 11);
    let icon = weather[i].weather[0].icon;
    /*...Here, we select a few elements by their Id of NAME : (i + 1). This is done to change which elements are being targeted, as the
    app sifts through the data it has collected, and decides where that data will be displayed. We mostly target the innerText property
    of the various elements with strings containing template literals, but we do specifically target the src property when selecting Id
    by icon- still with a string containing template literals(this is because these elements are img elements, and this will display
    our weather icon within the 5-day forecast).*/
    document.getElementById("card-" + (i + 1)).style.backgroundColor = 'azure';
    document.getElementById("date" + (i + 1)).innerHTML = `${day}, ${date}`;
    document.getElementById("icon" + (i + 1)).src = `http://openweathermap.org/img/w/${icon}.png`;
    document.getElementById("temp" + (i + 1)).innerText = `Temp: ${weather[i].main.temp}°F`;
    document.getElementById("wind" + (i + 1)).innerText = `Wind: ${weather[i].wind.speed}MPH`;
    document.getElementById("humid" + (i + 1)).innerText = `Humidity: ${weather[i].main.humidity}%`;
  };
};

/*displayWeather is a function which displays the daily weather within the main daily weather card. We first remove a class of hide from
our mainCityDisplay variable and set the display property of its style property to inline-block. Then we initialize the variable icon
as the icon property within the weather property at its first index, within the weather object. We then select a few elements by the Ids
of main-icon, city-temp, city-wind, and city-humid. In most of these we target the innerText property and set it to a string containing
template literals, but we do target the src property for main-icon, then set it to a string containing a template literal.*/
function displayWeather(weather) {
  mainCityDisplay.classList.remove("hide");
  mainCityDisplay.style.display = "inline-block";
  let icon = weather.weather[0].icon;
  document.getElementById("main-icon").src = `http://openweathermap.org/img/w/${icon}.png`;
  document.getElementById("city-temp").innerText = `Temp: ${weather.main.temp}°F`;
  document.getElementById("city-wind").innerText = `Wind: ${weather.wind.speed}MPH`;
  document.getElementById("city-humid").innerText = `Humidity: ${weather.main.humidity}%`;
};

/*While it might not initially look like it, this is a event listener. First, we enter a for loop, where we initialize the variable i as
0, test if i is LESS THAN the length property of forecastTimes, and iterate i if so. Then, we attach an event listener to forecastTimes
at an index, and upon a click we activate an event-driven anonymous function. Within this function, we initialize the variable
clickedTime as the innerText property of the target of our click-event. Entering a chain of if and else/if statements, we check to see if
clickedTime is equal to strings that evaluate to a time-of-day. If it is equal to these strings, we set the variable timeForForecast to
a string which evaluates to a number, then we call the determineFullForecast function(this is what allows the user to change the time of
day being displayed in their 5-day forecast).*/
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

/*Here, we attach an event listener to the searchSection variable, have it listen for a submit event, and upon this event triggering we
call the formSubmitHandler function. This is essentially the driver for our app.*/
searchSection.addEventListener("submit", formSubmitHandler);