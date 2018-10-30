import dotenv from 'dotenv';

import express from 'express';

import { WeatherAPI } from './weather_api/weather-api';

import { CurrencyExchangeAPI } from './currency_exchange_api/currency-exchange-api';

dotenv.config({ path: './environment.dev.env' });

const app = express();
const WEATHER_API_KEY = '0ba586948351bf0c489d6303d9638ede';
const CURRENCY_EXCHANGE_API_KEY = '8f8e93c51e144663a1b246ec18ac8ca9';

const weather = new WeatherAPI(WEATHER_API_KEY);
const currency = new CurrencyExchangeAPI(CURRENCY_EXCHANGE_API_KEY);

currency.getLatestRates().then( (latest) => {
    currency.latestRates = latest;
});

app.get('/', (req, res) =>  {
    weather.getLocation().then( (location) => {
        console.log(location);
        res.send(location);
    });
});

// Weather
app.get('/weather', (req, res) => {
    weather.getLocation().then( (location) => {
        console.log(location);
        weather.getCurrentConditions(location.longitude, location.latitude).then( (forecast) => {
            res.send(forecast);
        });
    }).catch( (err) => {
        console.log(err);
    });
});

app.get('/currency', (req, res) => {
     currency.getRate(100, 'SEK');
});

app.get('/currency/pref/remove/{currency}', (req, res) => {

    res.send('Currency preference removed');
});

app.get('/currency/pref/read', (req, res) => {
    currency.getPreferences();
  /*   currency.getPreferences().then( (resp) => {
       console.log(resp);
    }); */
});

app.listen(3000, () => console.log('Universal API listening on port 3000!'));
