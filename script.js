
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