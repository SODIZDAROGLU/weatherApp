$(function () {

    
    function generateCardBody(city){
        return $("<h5 class='card-title' data-city='citi-name'>"  + city.name +  " (<span> " + moment().format('l') + " </span>)<img id='icon' src='https://openweathermap.org/img/wn/"+ city.icon +".png' alt='current weather icon'/></h5><div class='weather-info'><p class='temp'>Temperature: " + city.temp + " ºF</p><p class='hum'>Humidity: " + city.humidity + "%</p><p class='wind'>Wind Speed: " + city.wind + " MPH</p><p class='uv'>UV Index: <span><button id='uvindex' type='button' class='btn text-white'>" + city.uv + "</button></span></p></div>");
    }

    
    function generateFiveDay(forecast){
        return $("<div class='card weather-card'><div class='card-body pb-3'><h6 class='date'>"+ forecast.date +"</h6><div id='icondiv' class='d-flex justify-content-between'><img src='https://openweathermap.org/img/wn/"+ forecast.icon +".png'></i></div><p>Temp: "+forecast.temp+" </p><p>Humidity: " +forecast.humidity+"</p></div></div>");
    }

    
    function generateButton(city){
        return $("<button type='button' id='"+city+"' class='btn btn-outline-info btn-block text-grey lighten-3'>"+ city+"</button>");
    }

    $("#basic-text1").on("click", function(event){

       
        event.preventDefault();

        
        $(".card-body").empty();
        $("#five-day-cards").empty();

       
        var searchCity = $("input").val();
        
        
        var cities = [];
        cities.push(searchCity);
        

       
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=imperial&appid=b77b0df55f67ef7f69baf547d226dda4";

        
        $.ajax({   
            url: queryURL,
            method: "GET",
            dataType: 'json',
            success: function (response1) {

               
               $.ajax({ 
                    url: 'https://api.openweathermap.org/data/2.5/uvi?appid=b77b0df55f67ef7f69baf547d226dda4&lat=' + response1.coord.lat + '&lon=' + response1.coord.lon + '',
                    method: "GET",
                    dataType: 'json',
                    success: function (response2) {

                       
                        var cityButtonEl = generateButton(response1.name);

                       
                        $(".btn-group-vertical").append(cityButtonEl);

                        
                        $.ajax({ 
                            url: 'https://api.openweathermap.org/data/2.5/forecast?q='+ response1.name +'&units=imperial&appid=b77b0df55f67ef7f69baf547d226dda4',
                            method: "GET",
                            dataType: 'json',
                            success: function (response3) {
                                
                               
                                var fiveDayArray = [];

                                for(var i=0; i<response3.list.length; i++) {
                                  
                                    var dayHour = moment(response3.list[i].dt_txt).format('HH');
                                  
                                    if(dayHour === "06") {
                                        fiveDayArray.push(response3.list[i]);
                                    }

                                }

                              
                                fiveDayForecast = [];

                                for(var i=0; i<fiveDayArray.length; i++){

                                  
                                    var forecast = {
                                        date: moment(fiveDayArray[i].dt_txt).format('MM/DD/YYYY'),
                                        icon: fiveDayArray[i].weather[0].icon,
                                        temp: fiveDayArray[i].main.temp,
                                        humidity: fiveDayArray[i].main.humidity    
                                    }

                                    fiveDayForecast.push(forecast);
                                }

                               
                                
                               
                                var cityData = {
                                    name: response1.name,
                                    icon: response1.weather[0].icon,
                                    temp: response1.main.temp,
                                    humidity: response1.main.humidity,
                                    wind: response1.wind.speed,
                                    uv: response2.value
                                }

                               
                                let merge = {
                                    cityData: cityData, 
                                    fiveDayForecast: fiveDayForecast
                                };

                                
                                localStorage.setItem(response1.name, JSON.stringify(merge));

                                
                                cityName = cities.pop();
                                cityObj = JSON.parse(localStorage.getItem(cityName));

                               
                                cardBodyEl = generateCardBody(cityObj.cityData);
                                $("#displaycity").append(cardBodyEl);

                             
                                for (const dayForecast of cityObj.fiveDayForecast) {
                                    fiveDayForecastEl = generateFiveDay(dayForecast);
                                    
                                    $("#five-day-cards").append(fiveDayForecastEl);
                                }
                                
                            } 
                        
                        }); 

                    } 

                }); 

            } 

        }); 

    }); 

  
    $(".btn-group-vertical").on("click", function(event){

        
        $(".card-body").empty();
        $("#five-day-cards").empty();

        event.preventDefault();

        
        var name = event.target.id;
        
       
        cityObj = JSON.parse(localStorage.getItem(name));

      
        cardBodyEl = generateCardBody(cityObj.cityData);
        $("#displaycity").append(cardBodyEl);

       
        for (const dayForecast of cityObj.fiveDayForecast) {
            fiveDayForecastEl = generateFiveDay(dayForecast);
         
            $("#five-day-cards").append(fiveDayForecastEl);
        }
        
    })
        
});   