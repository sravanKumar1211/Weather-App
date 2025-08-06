
    /* ==================== Config API ==================== */
    const API_KEY = 'ef162e8dd46f197be49eacffba4c775e'; 

    /* ==================== Elements ==================== */
    const searchBar = document.getElementById('search-bar');
    const submitBtn = document.getElementById('submit');
    const currentLocBtn = document.getElementById('current-loc');
    const recentCitiesBox = document.getElementById('recent-cities');
    const dropdown = document.getElementById('dropdown-menu');
    const popup = document.getElementById('popup');
    const tempToggle = document.getElementById('temp-toggle');
    const unitSign = document.getElementById('unitsign');
    const customAlert = document.getElementById('custom-alert');
    const dynamicBg = document.getElementById('dynamic-bg');
    let lastWeatherData = null,
      lastForecast = null;
    let tempUnit = 'C';

     /* ==================== Utilities ==================== */
    function setEl(id, val) {
      document.getElementById(id).innerText = val;
    }
    function kelvinToC(k) {
      return k - 273.15;
    }
    function cToF(c) {
      return c * 9 / 5 + 32;
    }
    function formatTemp(k) {
      let c = kelvinToC(k);
      return tempUnit === 'C' ? c.toFixed(1) : cToF(c).toFixed(1);
    }
    function formatVisibility(m) {
      return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : m + ' m';
    }
    function unixToTime(unix) {
      const d = new Date(unix * 1000);
      let h = d.getHours(),
        m = String(d.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = (h % 12) || 12;
      return `${h}:${m} ${ampm}`;
    }

    function getWeatherEmoji(icon) {
      if (icon.startsWith("01")) return "☀️";
      if (icon.startsWith("02")) return "⛅";
      if (icon.startsWith("03") || icon.startsWith("04")) return "☁️";
      if (icon.startsWith("09") || icon.startsWith("10")) return "🌧️";
      if (icon.startsWith("11")) return "⛈️";
      if (icon.startsWith("13")) return "❄️";
      if (icon.startsWith("50")) return "🌫️";
      return "🌈";
    }
//popups
     function showPopup(msg, error = false) {
      popup.textContent = msg;
      popup.style.display = 'block';
      popup.style.background = error ? '#fee' : '#f9fafb';
      popup.style.color = error ? '#b91c1c' : '#2563eb';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 3500);
    }

    
    /* ==================== Recent Searches ==================== */
    function getRecentCities() {
      return JSON.parse(localStorage.getItem("recentCities") || '[]');
    }
    function saveRecentCity(city) {
      city = city.trim();
      if (!city) return;
      let recents = getRecentCities().filter(c => c.toLowerCase() !== city.toLowerCase());
      recents.unshift(city);
      recents = recents.slice(0, 5);
      localStorage.setItem("recentCities", JSON.stringify(recents));
      updateRecentDropdown();
    }
    function updateRecentDropdown() {
      recentCitiesBox.innerHTML = '';
      let arr = getRecentCities();
      if (arr.length === 0) {
        dropdown.style.display = "none";
        return;
      }
      arr.forEach(city => {
        let btn = document.createElement('div');
        btn.className = "px-4 py-2 hover:bg-blue-100 text-gray-700 cursor-pointer";
        btn.tabIndex = 0;
        btn.textContent = city;
        btn.onclick = () => {
          searchBar.value = city;
          hideDropdown();
          validateAndFetch(city);
        };
        recentCitiesBox.appendChild(btn);
      });
      dropdown.style.display = "block";
    }


    /* ==================== Dropdown show/hide (hover only) ==================== */
    let dropdownTimeout;
    searchBar.addEventListener('mouseenter', () => {
      updateRecentDropdown();
      dropdown.style.display = 'block';
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    });
    searchBar.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => dropdown.style.display = 'none', 150);
    });
    dropdown.addEventListener('mouseenter', () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
      dropdown.style.display = 'block';
    });
    dropdown.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => dropdown.style.display = 'none', 150);
    });
    // Hide dropdown on click outside
    document.addEventListener('mousedown', e => {
      if (!searchBar.contains(e.target) && !dropdown.contains(e.target))
        dropdown.style.display = 'none';
    });

    
    /* ==================== Search Input Handling ==================== */
    searchBar.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitBtn.click();
    });

    /* ==================== Validate & Fetch ==================== */
    function validateAndFetch(city) {
      if (!city || city.trim().length < 2) {
        showPopup("Please enter a valid city name.", true);
        return;
      }
      fetchWeatherByCity(city.trim());
    }

    /* ==================== Search Button ==================== */
    submitBtn.addEventListener('click', () => {
      const city = searchBar.value.trim();
      validateAndFetch(city);
    });

      /* ==================== Current Location Button ==================== */
    currentLocBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showPopup("Geolocation not supported by your browser.", true);
        return;
      }
      setLoadingState(true);
      navigator.geolocation.getCurrentPosition(
        pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        () => {
          showPopup("Unable to retrieve your location.", true);
          setLoadingState(false);
        }
      );
    });

     /* ==================== Fetch Functions ==================== */
    async function fetchWeatherByCity(city) {
      setLoadingState(true);
      try {
        const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
        const weatherData = await weatherResp.json();
        if (weatherData.cod !== 200) throw new Error(weatherData.message || "City not found");
        lastWeatherData = weatherData;
        saveRecentCity(weatherData.name || city);
        renderMainWeather(weatherData);
        setWeatherBg(weatherData);
        await fetchDetails(weatherData.coord.lat, weatherData.coord.lon);
        await fetchForecast(weatherData.coord.lat, weatherData.coord.lon);
        dropdown.style.display = 'none';
      } catch (err) {
        showPopup(err.message || "Error fetching weather data.", true);
      }
      setLoadingState(false);
    }

    async function fetchWeatherByCoords(lat, lon) {
      setLoadingState(true);
      try {
        const weatherResp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const weatherData = await weatherResp.json();
        if (weatherData.cod !== 200) throw new Error("Unable to fetch location weather.");
        lastWeatherData = weatherData;
        renderMainWeather(weatherData);
        setWeatherBg(weatherData);
        saveRecentCity("Current Location");
        await fetchDetails(lat, lon);
        await fetchForecast(lat, lon);
        dropdown.style.display = 'none';
        searchBar.value = '';
      } catch (err) {
        showPopup(err.message || "Error fetching location weather.", true);
      }
      setLoadingState(false);
    }

    async function fetchDetails(lat, lon) {
      try {
        const pollutionResp = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const pollutionData = await pollutionResp.json();
        if (pollutionData.list?.length) {
          const comp = pollutionData.list[0].components;
          setEl('co', comp.co.toFixed(2));
          setEl('so2', comp.so2.toFixed(2));
          setEl('o3', comp.o3.toFixed(2));
          setEl('no2', comp.no2.toFixed(2));
        }
      } catch { /* fail silently */ }
    }

    async function fetchForecast(lat, lon) {
      try {
        const forecastResp = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const forecastData = await forecastResp.json();
        lastForecast = forecastData;
        const today = new Date().toISOString().split('T')[0];
        const todayForecasts = forecastData.list.filter(f => f.dt_txt.startsWith(today)).slice(0, 6);
        renderHourly(todayForecasts);

        let days = {};
        forecastData.list.forEach(item => {
          const date = item.dt_txt.split(' ')[0];
          if (!days[date] || item.main.temp > days[date].temp) {
            days[date] = {
              temp: item.main.temp,
              icon: item.weather[0].icon,
              desc: item.weather[0].description
            };
          }
        });

        renderForecast(days);
      } catch { /* fail silently */ }
    }


     /* ==================== Render Functions ==================== */
    function renderMainWeather(data) {
      setEl('city-name', data.name || '-');
      setEl('temperature', formatTemp(data.main.temp));
      setEl('weatherDesc', capitalizeFirstLetter(data.weather[0].description));
      setEl('humidity', data.main.humidity + '%');
      setEl('pressure', data.main.pressure + ' hPa');
      setEl('feelslike', formatTemp(data.main.feels_like));
      setEl('visibility', formatVisibility(data.visibility));
      setEl('sunrise', unixToTime(data.sys.sunrise));
      setEl('sunset', unixToTime(data.sys.sunset));
      setEl('date', (new Date()).toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' }));
      formatTempUnit();
      checkWeatherAlerts(data);
    }