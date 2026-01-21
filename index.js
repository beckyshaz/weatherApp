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
            console.log(day.conditions, day.datetime, day.feelslike, day.humidity, day.windspeed, day.temp);
            return {
            
                conditions: day.conditions,
                day: dateFormatter(day.datetime),
                feelslike: day.feelslike,
                humidity: day.humidity,
                windspeed: day.windspeed,
                temp: day.temp

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
        weekday: "short"
    }
    const dateObj = new Date(date);

    const formatedDate = new Intl.DateTimeFormat("en-Us", options).format(dateObj);
    return formatedDate;
}

async function displayInfoToUser() {
    try {
        const weatherData = await getneededWeatherInfo();
        console.log(weatherData);

        const weatherContainer = document.querySelector(".weather-elements-container");

        if (weatherData) {

            weatherData.forEach(element => {
                const outerDiv = document.createElement("div");
                outerDiv.className = 'elementsDiv';
                const dayElement = document.createElement("p");
                dayElement.textContent = element.day;

                const tempElement = document.createElement("p");
                tempElement.textContent = `${element.temp}°`;


                
                const feelslikeElement = document.createElement("p");
                feelslikeElement.textContent = `Feels Like ${element.feelslike}°`;
                
                const conditionsElement = document.createElement("p");
                conditionsElement.textContent = element.conditions;
                
                const humidityElement = document.createElement("p");
                humidityElement.textContent = `Humidity => ${element.humidity}`;
                
                const windspeedElement = document.createElement("p");
                windspeedElement.textContent = `Wind => ${element.windspeed}`;

                outerDiv.append(dayElement, feelslikeElement, conditionsElement, humidityElement, windspeedElement)
                
                weatherContainer.appendChild(outerDiv);  
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

                resolve(location);
            
               

            }else {
                reject("no location received");
            }
        }

        form.addEventListener("submit", submitHandler);
        
    })
    

}


//getLocationFromForm();
