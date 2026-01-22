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

//getWeatherData("nairobi")
//.then((res) => console.log(res))



//getWeatherData("nairobi").catch((err) => console.log(err));

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

        const currentDayWeather = document.querySelector(".currentDay-weather");

        const humTempWindContainer = document.querySelector(".humTempAndWind");

        if (weatherData) {

            weatherData.forEach(element => {

                const outerContainer = document.createElement("div");
                outerContainer.className = 'weather-elementsDiv';
                const dayElement = document.createElement("p");
                dayElement.textContent = element.day;
                

                const tempElement = document.createElement("p");
                tempElement.textContent = `${element.tempMin }°C / ${element.tempMax}°C`;

                outerContainer.append(dayElement, tempElement);
                weatherContainer.appendChild(outerContainer);


                if (element.day === "Today") {
                    const outerDiv = document.createElement("div");
                    outerDiv.className = 'current-day-weather-div';
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
                    
                    const humidityElement = document.createElement("p");
                    humidityElement.textContent = `Humidity => ${element.humidity}`;
                    humidityElement.className = "humidity";

                    const precipElement = document.createElement("p");
                    precipElement.textContent = `Precipitation => ${element.precip}%`;
                    precipElement.className = "precipitation";
                    
                    
                    const windspeedElement = document.createElement("p");
                    windspeedElement.textContent = `Wind => ${element.windspeed}`;
                    windspeedElement.className = "wind";

                    humTempWindContainer.append(humidityElement, precipElement, windspeedElement);
                    outerDiv.append(dayElement, feelslikeElement, conditionsElement, humTempWindContainer)
                    
                    currentDayWeather.appendChild(outerDiv);  

                }
                
            });
           


            
            

        }
    } catch (error) {
        
    }
}

displayInfoToUser()
function getLocationFromForm() {

    const form = document.querySelector("form");
        
    const locationInput = document.querySelector("#location");
        

    return new Promise((resolve, reject) => {

        function submitHandler(event) {
            event.preventDefault();

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
