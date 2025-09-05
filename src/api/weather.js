const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY || "260f2fe32f230748d41342692644204f";

export async function getCurrentWeather(cityOrCoords) {
  let url;
  if (typeof cityOrCoords === "string") {
    // Buscar por nome da cidade
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      cityOrCoords
    )}&appid=${API_KEY}&lang=pt_br&units=metric`;
  } else if (typeof cityOrCoords === "object" && cityOrCoords.lat && cityOrCoords.lon) {
    // Buscar por latitude e longitude
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&appid=${API_KEY}&lang=pt_br&units=metric`;
  } else {
    throw new Error("Parâmetro inválido para getCurrentWeather");
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar clima atual");
  return res.json();
}

export async function getForecast(cityOrCoords) {
  let url;
  if (typeof cityOrCoords === "string") {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      cityOrCoords
    )}&appid=${API_KEY}&lang=pt_br&units=metric`;
  } else if (typeof cityOrCoords === "object" && cityOrCoords.lat && cityOrCoords.lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&appid=${API_KEY}&lang=pt_br&units=metric`;
  } else {
    throw new Error("Parâmetro inválido para getForecast");
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro na previsão");
  return res.json();
}

// Função para gerar previsão diária a partir do forecast de 3h
export function gerarPrevisaoDiaria(forecastList) {
  const dias = {};

  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dia = date.toISOString().split("T")[0]; // YYYY-MM-DD

    if (!dias[dia]) {
      dias[dia] = {
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        weather: item.weather[0],
      };
    } else {
      dias[dia].temp_min = Math.min(dias[dia].temp_min, item.main.temp_min);
      dias[dia].temp_max = Math.max(dias[dia].temp_max, item.main.temp_max);
    }
  });

  return Object.keys(dias).map(dia => ({
    date: dia,
    temp_min: Math.round(dias[dia].temp_min),
    temp_max: Math.round(dias[dia].temp_max),
    weather: dias[dia].weather,
  }));
}
