import { useState, useEffect } from 'react'

import countryService from "./services/countries"

const weatherIconUrl = 'https://openweathermap.org/payload/api/media/file/'


const CountryInfo = ({ country, weatherInfo }) => {

  const capital = country.capital
  const population = country.population
  const flagImg = country.flags.png

  const flagImgAlt = country.flags.alt
  const languages = country.languages
  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital: {capital}</p>
      <p>Population: {population}</p>
      <ol>{Object.values(languages).map((lang, index) => <li key={index}>{lang}</li>)}</ol>
      <img src={flagImg} alt={flagImgAlt} />
      <h1>Temperature overview</h1>
      <p>Temperature: {Math.round((weatherInfo.main.temp - 273.1) * 100) / 100} Celcius</p>
    </>
  )

}

const CountryBlock = ({ countries, setCountries, weatherInfo }) => {
  if (countries.length >= 10) {
    return (
      <p>Found more than 10 countries, need a more narrow filter.</p>
    )

  } else if (countries.length > 1) {

    return (
      <ol>
        {countries.map((country, index) => <li key={index}>{country.name.common} <button onClick={() => setCountries([country])}>Show</button></li>)}
      </ol>
    )
  } else if (countries.length == 1) {
    return (
      <CountryInfo country={countries[0]} weatherInfo={weatherInfo} />
    )



  }

}


function App() {
  const [allCountries, setCountries] = useState([])
  const [searchField, setSearchField] = useState('')
  const [weatherInfo, setWeatherInfo] = useState([])

  useEffect(() => {

    countryService.getAll().then(countries => {
      const filterCountries = countries.filter(country => country.name.common.toLowerCase().startsWith(searchField))
      if (filterCountries.length == 1) {
        const country = filterCountries[0]
        countryService.getOne(country.name.common).then(foundCountry => setCountries([foundCountry]))


        countryService.getWeather(country.capital[0]).then(weather => {
          countryService.getWeatherIcon(weather.weather[0].icon).then(weatherIcon => {
            console.log(weather)

            weather.icon = weatherIcon
            setWeatherInfo(weather)
            console.log(weatherInfo)
          }
          )
        })

      } else {

        setCountries(filterCountries)
      }
    })

  }, [searchField]
  )


  const selectCountry = (event) => {
    setSearchField(event.target.value)

  }


  return (
    <>

      <form>

        <p>find countries</p>

        <input value={searchField} onChange={selectCountry} />
      </form>

      <CountryBlock countries={allCountries} setCountries={setCountries} weatherInfo={weatherInfo} />
    </>
  )
}

export default App
