import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather'
const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const getAll = () => {
  const request = axios.get(baseUrl + 'all')
  return request.then(response => response.data)
}

const getOne = (country) => {
  const request = axios.get(baseUrl + 'name/' + country)
  return request.then(response => response.data)
}



const getWeather = (city) => {
  console.log(city)
  const request = axios.get(weatherUrl, { params: { q: city, appid: api_key } })
  return request.then(response => response.data)
}

const getWeatherIcon = (code) => {
  const request = axios.get(`'${weatherIconUrl}'${code}'.png`)
  return request.then(response => response.data)
}

export default {
  getAll,
  getOne,
  getWeather,
}
