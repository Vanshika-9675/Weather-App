
// let APIkey= "b57e6ab9eb24ead898b300ba80c387dd";

// async function  fetchWeatherDetails(){
//     let city="uttar Pradesh";
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
//     let data = await response.json();
//     console.log("Data->",data);
//     renderWeatherInfo(data);
// }

// function renderWeatherInfo(data){
//     try{
//         const temperature=data.main.temp;
    
//         const weatherInfoDiv = document.getElementById('weatherInfo');

//         let temp_para= document.createElement('p');
    
//         temp_para.textContent=`temperature : ${temperature}`;

//         weatherInfoDiv.append(temp_para);
//     }
//     catch(err){
//           console.log("Error found:",err);
//     }
// }

const userTab = document.querySelector("[data-userWeather]");
const searchTab= document.querySelector("[data-searchWeather]");
const userContainer= document.querySelector(".weather-container");
const grantAcessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-search-form]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab= userTab;

let APIkey= "b57e6ab9eb24ead898b300ba80c387dd";

currentTab.classList.add("currentTab");

getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");     
    }
    //cuurent tab have active class
    //now if searchForm tab does not have active class this means that tab is now clicked  !! 
    // and we have to add active class in search form and remove it from grant access container and user info container
    if(!searchForm.classList.contains("active")){
          grantAcessContainer.classList.remove("active");
          userInfoContainer.classList.remove("active");
          searchForm.classList.add("active");
    }
    //it means i have clicked on your weather now I have to make invisible searchform 
    else{
         searchForm.classList.remove("active");
         //initially userinfocontainer is also not visible
         userInfoContainer.classList.remove("active");
         //now i am in you weather tab , firstly we will check in our session storage wherther user have provided
         //access before that is if we have latitude and longitude in session storage than we will show weather info. directly to user
         getfromSessionStorage();

    }
}
userTab.addEventListener("click" , ()=>{
     switchTab(userTab);
});

searchTab.addEventListener("click" , ()=>{
     switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getfromSessionStorage(){
   const localCoordinates = sessionStorage.getItem("user_coordinates");
   if(!localCoordinates){
     //it means grant location window needs to be displayed
      grantAcessContainer.classList.add("active");
   }
   else{    
       // it means we have coordinates therefore we need to get cooredinates and fetch user info by api call
       const coordinates= JSON.parse(localCoordinates); //converting json string into js object
       fetchUserWeatherInfo(coordinates);
   }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    //as we are making an api call we need to display loader till we get data
    //make grant access container invisible
    grantAcessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`);
        const data =  await response.json();
        //now we have data we can make loading screen invisible and render user information
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        //this function will put values in UI
        renderWeatherInfo(data);
    }
    catch(err){
         loadingScreen.classList.remove("active");
         //
    }
}

function renderWeatherInfo(weatherInfo){
    // we want location , country code for flag , description , weather icon , temperature , windspeed and humidity
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDescription]");
    const weatherIcon  = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    
    cityName.innerText = weatherInfo?.name; // ?. is optional chaining operator  
    const country_code = weatherInfo?.sys?.country.toLowerCase();
    countryIcon.src = `https://flagcdn.com/48x36/${country_code}.png`;
    //in json weather is an array therefore
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

const grantAcessButton = document.querySelector("[data-grant-acess]");
grantAcessButton.addEventListener("click",getlocation);

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no geolocation available
        console.log("error");
    }
}

function showPosition(position){
   const userCoordinates ={
     lat: position.coords.latitude,
     lon:  position.coords.longitude
   }
   sessionStorage.setItem("user_coordinates",JSON.stringify(userCoordinates));
   fetchUserWeatherInfo(userCoordinates);
}

let searchInput = document.querySelector("[data-search-input]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    
    let city =searchInput.value;
    if(city==="") return;

    else
       fetchSearchWeatherInfo(city);
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessButton.classList.remove("active");

    try{
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch{
        //
    }

}


