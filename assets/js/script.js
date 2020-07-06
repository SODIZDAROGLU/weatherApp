$(function () {

    // Generates the content inside the weather city info
    function generateCardBody(city){
        return $("<h5 class='card-title' data-city='citi-name'>"  + city.name +  " (<span> " + moment().format('l') + " </span>)<img id='icon' src='https://openweathermap.org/img/wn/"+ city.icon +".png' alt='current weather icon'/></h5><div class='weather-info'><p class='temp'>Temperature: " + city.temp + " ºF</p><p class='hum'>Humidity: " + city.humidity + "%</p><p class='wind'>Wind Speed: " + city.wind + " MPH</p><p class='uv'>UV Index: <span><button id='uvindex' type='button' class='btn text-white'>" + city.uv + "</button></span></p></div>");
    }

    // Generates the content inside the 5 cards weather forecast
    function generateFiveDay(forecast){
        return $("<div class='card weather-card'><div class='card-body pb-3'><h6 class='date'>"+ forecast.date +"</h6><div id='icondiv' class='d-flex justify-content-between'><img src='https://openweathermap.org/img/wn/"+ forecast.icon +".png'></i></div><p>Temp: "+forecast.temp+" </p><p>Humidity: " +forecast.humidity+"</p></div></div>");
    }

    // Creates a button for each city
    function generateButton(city){
        return $("<button type='button' id='"+city+"' class='btn btn-outline-info btn-block text-grey lighten-3'>"+ city+"</button>");
    }

    $("#basic-text1").on("click", function(event){

        // the default action is to refresh the page
        event.preventDefault();

        // empty the cards when the search button is clicked
        $(".card-body").empty();
        $("#five-day-cards").empty();

        // grab the text inside the input field
        var searchCity = $("input").val();
        
        // create an array to include all the cities searched by the user
        var cities = [];
        cities.push(searchCity);
        

        // set the queryURL with the proper search query 
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=b5540c4c5b50c563c63c9a4c1e188656";

        // Make an ajax call to request the desired information for the city
        $.ajax({   
            url: queryURL,
            method: "GET",
            dataType: 'json',
            success: function (response1) {

                // Make a second ajax call to get the UV Index
               $.ajax({ 
                    url: 'https://api.openweathermap.org/data/2.5/uvi?appid=b5540c4c5b50c563c63c9a4c1e188656&lat=' + response1.coord.lat + '&lon=' + response1.coord.lon + '',
                    method: "GET",
                    dataType: 'json',
                    success: function (response2) {

                        // Create the city button on the left column
                        var cityButtonEl = generateButton(response1.name);

                        // Append the city button to the left column
                        $(".btn-group-vertical").append(cityButtonEl);

                        // Make a third ajax call to get the 5 days forecast
                        $.ajax({ 
                            url: 'https://api.openweathermap.org/data/2.5/forecast?q='+ response1.name +'&units=imperial&appid=b5540c4c5b50c563c63c9a4c1e188656',
                            method: "GET",
                            dataType: 'json',
                            success: function (response3) {
                                
                                // This array will hold the 5 days selected from the 40 forecast objects
                                var fiveDayArray = [];

                                for(var i=0; i<response3.list.length; i++) {
                                    // Get the hour of the day in the proper format
                                    var dayHour = moment(response3.list[i].dt_txt).format('HH');
                                    // If the hour is 6 am, add the element to the array
                                    if(dayHour === "06") {
                                        fiveDayArray.push(response3.list[i]);
                                    }

                                }

                                // This array will hold the the data
                                fiveDayForecast = [];

                                for(var i=0; i<fiveDayArray.length; i++){

                                    // Create an object to hold the data for the forecast
                                    var forecast = {
                                        date: moment(fiveDayArray[i].dt_txt).format('MM/DD/YYYY'),
                                        icon: fiveDayArray[i].weather[0].icon,
                                        temp: fiveDayArray[i].main.temp,
                                        humidity: fiveDayArray[i].main.humidity    
                                    }

                                    fiveDayForecast.push(forecast);
                                }

                                // Create an object to hold the city data
                                var cityData = {
                                    name: response1.name,
                                    icon: response1.weather[0].icon,
                                    temp: response1.main.temp,
                                    humidity: response1.main.humidity,
                                    wind: response1.wind.speed,
                                    uv: response2.value
                                }

                                // Create an object that contains both objects: city and forecast data
                                let merge = {
                                    cityData: cityData, 
                                    fiveDayForecast: fiveDayForecast
                                };

                                // Add the data to local storage
                                localStorage.setItem(response1.name, JSON.stringify(merge));

                                // Get the last city from the array and retrieve it from local storage
                                cityName = cities.pop();
                                cityObj = JSON.parse(localStorage.getItem(cityName));

                                // Generate the city weather information display
                                cardBodyEl = generateCardBody(cityObj.cityData);
                                $("#displaycity").append(cardBodyEl);

                                // Create the 5 day forecast elements with the content
                                for (const dayForecast of cityObj.fiveDayForecast) {
                                    fiveDayForecastEl = generateFiveDay(dayForecast);
                                    // Append the 5 cards
                                    $("#five-day-cards").append(fiveDayForecastEl);
                                }
                                
                            } // end of success response 3
                        
                        }); // end of ajax call 3

                    } // end of success response 2

                }); // end of ajax call 2

            } // end of success response 1

        }); // end of ajax call 1

    }); // end of on click function

    // Create an on clcik event for the group of buttons on the left panel
    $(".btn-group-vertical").on("click", function(event){

        // Empty the cards
        $(".card-body").empty();
        $("#five-day-cards").empty();

        event.preventDefault();

        // Get the city name from the pressed button
        var name = event.target.id;
        
        // Retrieve the city info from local storage
        cityObj = JSON.parse(localStorage.getItem(name));

        // Generate DOM elements
        cardBodyEl = generateCardBody(cityObj.cityData);
        $("#displaycity").append(cardBodyEl);

        // Create the 5 day forecast elements and add the content
        for (const dayForecast of cityObj.fiveDayForecast) {
            fiveDayForecastEl = generateFiveDay(dayForecast);
            // Append the 5 cards
            $("#five-day-cards").append(fiveDayForecastEl);
        }
        
    })
        
}); // End of document ready  