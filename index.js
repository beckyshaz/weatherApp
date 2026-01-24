async function getWeatherData(location) {
    try {
        const weatherData = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today/next6days?unitGroup=metric&key=584UVBLL4G2U57Z5FFZ5ZA88V&include=days`)
        console.log(weatherData);
        
        
        if (weatherData.ok) {
            const json = await weatherData.json();
            console.log(json);
            return json;
        }else {
            console.log("HTTP Error occured", weatherData.status);
            throw new Error(`${weatherData.status}:  ${weatherData.statusText}`);
        }
    } catch (error) {
        console.log("An Error occurred", error);
        throw error;
    }
    
}



function getneededWeatherInfo() {

    //const weatherData = await (getWeatherData());

    return getLocationFromForm().then((location) => {
        return getWeatherData(location)
    })
    .then((res) => {
        console.log(res.days);
        const sevenDaysWeatherData = res.days;
        const neededWeatherData = sevenDaysWeatherData.map(day => {
            console.log(day.conditions, day.datetime, day.feelslike, day.humidity, day.windspeed, day.temp, );
            return {
            
                conditions: day.conditions,
                day: dateFormatter(day.datetime),
                feelslike: day.feelslike,
                humidity: day.humidity,
                windspeed: day.windspeed,
                temp: day.temp,
                precip: (day.precip * 100),
                tempMax: day.tempmax,
                tempMin: day.tempmin,

            }
        });
        return neededWeatherData;
        
    })

    .catch((error) => {
        console.log("Error on getting weather data", error);
        return [];
    })

}
 
//getneededWeatherInfo();
function dateFormatter(date) {
    let options = {
        weekday: "long",
        day: "numeric",
    }
    const dateObj = new Date(date);

    console.log(dateObj);

    const todayDate = new Date();
    console.log(todayDate);

   if(dateObj.toDateString() === todayDate.toDateString()) {
    return "Today";
   }else {
    const formatedDate = new Intl.DateTimeFormat("en-Us", options).format(dateObj);
    return formatedDate;
   }


}

async function displayInfoToUser() {
    try {
        const weatherData = await getneededWeatherInfo();
        console.log(weatherData);

        const weatherContainer = document.querySelector(".weather-elements-container");

        const currentDayWeather = document.querySelector(".currentDay-weather-container");

        
        if (weatherData) {

            const loader = document.querySelector(".loader");
            loader.style.display = "none";

            weatherData.forEach(element => {

                const outerContainer = document.createElement("div");
                outerContainer.className = 'weather-elements-innerDiv';

               
                const dayElement = document.createElement("p");
                dayElement.textContent = element.day;


                const tempRangeElement = document.createElement("p");
                tempRangeElement.textContent = `${element.tempMin }°C / ${element.tempMax}°C`;

                if (outerContainer) {
                    outerContainer.append(dayElement, tempRangeElement);
                  
                    handleEventListener(outerContainer, currentDayWeather, element);
                    weatherContainer.appendChild(outerContainer);
                }else {
                    console.log("container not found");
                }
                
                
                if (element.day === "Today") {
                    const outerDiv = document.createElement("div");
                    outerDiv.className = 'current-day-weather-innerDiv';
                    createDomElements(element, outerDiv, currentDayWeather);
                }
            });
        }} catch (error) {
            console.log("an error occured", error);
            throw error;

        }
}


function handleEventListener(elementsInnerContainer, currentDayWeatherContainer, element) {
    elementsInnerContainer.addEventListener("click", (event) => {
        if (event) {
            console.log(event.currentTarget);
            currentDayWeatherContainer.textContent = "";
            //currentDayWeatherContainer.style.display = "block";

            
            const clickedWeatherelementDiv = document.createElement("div");
            clickedWeatherelementDiv.classList = "clicked-div current-day-weather-innerDiv";
            createDomElements(element, clickedWeatherelementDiv, currentDayWeatherContainer);
        }
    });
    
}


displayInfoToUser()

function createDomElements(element, innerContainer, currentDayContainer) {
    
    const dayElement = document.createElement("p");
    dayElement.textContent = element.day;
    dayElement.className = "current-day";

    const tempElement = document.createElement("p");
    tempElement.textContent = `${element.temp}°C`;
    tempElement.className = "temp";


    
    const feelslikeElement = document.createElement("p");
    feelslikeElement.textContent = `Feels Like ${element.feelslike}°`;
    feelslikeElement.className = "feelslike";
    
    const conditionsElement = document.createElement("p");
    conditionsElement.textContent = element.conditions;
    conditionsElement.className = "conditions";

    const innerTempHumAndWindContainer = document.createElement("div");
    innerTempHumAndWindContainer.className = "humTempAndWind";

    
    const humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity => ${element.humidity}`;
    humidityElement.className = "humidity";

    const precipElement = document.createElement("p");
    precipElement.textContent = `Precipitation => ${element.precip}%`;
    precipElement.className = "precipitation";
    
    
    const windspeedElement = document.createElement("p");
    windspeedElement.textContent = `Wind => ${element.windspeed}`;
    windspeedElement.className = "wind";

    innerTempHumAndWindContainer.append(humidityElement, precipElement, windspeedElement);
    innerContainer.append(dayElement, tempElement, conditionsElement, 
        feelslikeElement, innerTempHumAndWindContainer)
    
    currentDayContainer.appendChild(innerContainer);
    currentDayContainer.style.display = "block";
   // addEventListener(outerContainer, outerDiv);



}

function getLocationFromForm() {

    const form = document.querySelector("form");
        
    const locationInput = document.querySelector("#location");
        

    return new Promise((resolve, reject) => {

        function submitHandler(event) {
            event.preventDefault();

            const loader = document.querySelector(".loader");

            loader.style.display = "block";

            const location =  locationInput.value;
            console.log(location);

            form.removeEventListener("submit", submitHandler);

            if (location) {

                locationInput.value = "";

                const titlecontainer = document.querySelector(".title-container");
                titlecontainer.style.display = "none";

                resolve(location);
            
               

            }else {
                reject("no location received");
            }
        }

        form.addEventListener("submit", submitHandler);
        
    })
    

}


//getLocationFromForm();




