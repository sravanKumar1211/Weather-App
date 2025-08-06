
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