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
            console.log(day.conditions, day.datetime, day.feelslike, day.humidity, day.windspeed);
            return {
                conditions: day.conditions,
                day: day.datetime,
                feelslike: day.feelslike,
                humidity: day.humidity,
                windspeed: day.windspeed

            }
        });
        return neededWeatherData;
        
    })

    .catch((error) => {
        console.log("Error on getting weather data", error);
        return [];
    })

}

getneededWeatherInfo();


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
