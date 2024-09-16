document.addEventListener("DOMContentLoaded", () => {
    let truefalse = false;
  
    //function to update Time at interval of every 1 sec
    function currDateTime() {
      const date = new Date();
      document.getElementById("date").innerHTML = `Date: ${date.toDateString()}`;
      document.getElementById("time").innerHTML = `Time: ${date.toLocaleTimeString("en-US")}`;
    }
    setInterval(currDateTime, 1000);
    currDateTime();
  
    // fetch and store city data use by elementID
    const CityNames = JSON.parse(localStorage.getItem("CityName")) || [];
    console.log(CityNames);
    const dropdown = document.getElementById("cityList");
  
    document.getElementById("cityName").addEventListener("focus", () => {
      const findCities = CityNames.filter((city) => city.toLowerCase());
      dropdown.innerHTML = "";
      findCities.forEach((city) => {
        const listItem = document.createElement("option");
        listItem.value = city;
        listItem.textContent = city;
        dropdown.appendChild(listItem);
      });
    });
  
    document.getElementById("cityName").addEventListener("input", () => {
      const inputValue = document.getElementById("cityName").value.toLowerCase();
      dropdown.innerHTML = "";
      if (inputValue) {
        const findCities = CityNames.filter((city) =>
          city.toLowerCase().includes(inputValue)
        );
        findCities.forEach((city) => {
          const listItem = document.createElement("option");
          listItem.value = city;
          dropdown.appendChild(listItem);
          
        });
        
      }
    });
  
    //function to show the data through the city name & alert message
   
    function onClick(e) {
      e.preventDefault();
      var city = document.getElementById("cityName").value;
      if (!city) {
        alert("Please enter the city Name.....!");
        return;
      }
  
      alert("Please Wait for some time...........!");

      localStorage.setItem("cityName", city);  
      if (!CityNames.includes(city)) {
        CityNames.push(city);
      }
  
      localStorage.setItem("CityName", JSON.stringify(CityNames));
      document.getElementById("searchform").reset();
  
      var storedCity = localStorage.getItem("cityName"); 
      storedCity =
        storedCity === null || storedCity.trim() === "" ? "London" : storedCity;
  
      console.log(`${storedCity}`);
      const cityUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${storedCity}`;
      const url = window.location.protocol === 'https:' 
      ? `https://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`
      :  `http://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`;
      
      
      async function fetchDataPosition() {
        await fetchData(url);
        fetchPosition(cityUrl);
    }
    
    fetchDataPosition();
  
    }
  
    //Fetch weather through cityname
  
    document.getElementById("button1").addEventListener("click", onClick);
  
    // Fetch the current position
  
    document.getElementById("currentloc").addEventListener("click", function (e) {
        e.preventDefault();
        truefalse = true;
        if (navigator.geolocation) {
          alert("Please wait for getting your position!");
          navigator.geolocation.getCurrentPosition(latiLongi, error);
        } else {
          alert("Some issues in finding current location.");
        }
  
        function latiLongi(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
  
          const apiURL = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  
          fetch(apiURL)
            .then((response) => response.json())
            .then((data) => {
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "Unknown location";
            
              localStorage.setItem("cityName", city); 
              alert(`Your current city is: ${city}`);
              localStorage.setItem("longituted", longitude);
              localStorage.setItem("lattitud", latitude);
              window.location.reload();
            })
            .catch(() =>
              alert("Failed to retrieve city name. Please try again.")
            );
        }
  
        function error() {
          alert("Unable to retrieve your location.");
        }
      });
  
    var storedCity = localStorage.getItem("cityName");  
    storedCity =
      storedCity === null || storedCity.trim() === "" ? "London" : storedCity;
    console.log(`${storedCity}`);
  
    // api data
    const url = window.location.protocol === 'https:' 
    ? `https://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`
    :  `http://api.weatherapi.com/v1/forecast.json?key=869dedcd8c6b441e89595705242108&q=${storedCity}&days=5`;
  
    async function fetchData(url) {
      try {
        const response = await fetch(url);
        const resultdata = await response.json();
        console.log(resultdata);
  
        // current wether information
        document.getElementById(
          "location"
        ).innerHTML = `${resultdata.location.name}(${resultdata.location.localtime})`;
        document.getElementById(
          "temprature"
        ).innerHTML = `Temprature : ${resultdata.current.temp_c} C`;
        document.getElementById(
          "wind"
        ).innerHTML = `Wind : ${resultdata.current.wind_kph} m/s`;
        document.getElementById(
          "humadity"
        ).innerHTML = `Humidity : ${resultdata.current.humidity}%`;
        document.getElementById(
          "currcondition"
        ).innerHTML = `${resultdata.current.condition.text}`;
        document.getElementById(
          "image"
        ).src = `//cdn.weatherapi.com/weather/64x64/day/116.png`;
  
        // weather foreast for next 5 days, note: weatherapi.com gives only 3 days forecast for free subscription
  
        const nextFivedays = document.getElementById("futureWeather");
        nextFivedays.innerHTML = "";
        resultdata.forecast.forecastday.forEach((days) => {
          const forecast = document.createElement("section");
          forecast.className =
            "bg-yellow-100 hover:scale-100 text-center mt-10 ml-14 mr-14 mb-8 md:m-12 shadow-inner md:shadow-2xl shadow-grey-400/50 rounded-lg leading-8 p-2  md:p-10 md:leading-10 lg:m-4 lg:p-2 lg:leading-4";
          forecast.innerHTML = ` <p class="text-xl font-semibold md:text-2xl md:mt-2">Date(${days.date})</p>
                          <img src=${days.day.condition.icon} class="ml-20 mb-2 md:ml-12" width="80px" alt="wether image">
                          <p class="font-semibold md:text-lg">Temprature: ${days.day.avgtemp_c} <sup>0</sup>C</p>
                          <p class="font-semibold md:text-lg">Wind: ${days.day.maxwind_kph} m/s</p>
                          <p class="font-semibold md:text-lg">Humadity: ${days.day.avghumidity}%</p>`;
          nextFivedays.appendChild(forecast);
        });
      } catch (error) {
        console.error("Error fetching data: something enter wrong", error);
        alert("the name of the city is  incorrect.........the default city data will be loaded...!");
        const city = localStorage.getItem('cityName')
        localStorage.removeItem('cityName');
        CityNames.pop(city);
        localStorage.setItem("CityName", JSON.stringify(CityNames));
  
        localStorage.setItem("longituted", -0.118092);
        localStorage.setItem("lattitud", 51.509865);
    
        window.location.reload();
      }
    }
    fetchData(url);
  

  
    async function fetchPosition(url) {
      try{
   const result = await fetch(url);
   const coordinat = await result.json();
   console.log(coordinat)
  
   const latitude = coordinat[0].lat;
   const longitude =coordinat[0].lon;
   localStorage.setItem('longituted',longitude);
   localStorage.setItem('lattitud',latitude)
  window.location.reload();
      }catch(err){
        console.error("Error:", err);
      } 
          } 
  
     
    
  });
  