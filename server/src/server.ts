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

app.get('/', (req: any, res: any) =>  {
    weather.getLocation().then( (location) => {
        console.log(location);
        res.send(location);
    });
});

app.get('/location/:ip', (req: any, res: any) =>  {
    const data = {
        ip : req.params.ip,
    };
    weather.getLocation(data.ip).then( (location) => {
        console.log(location);
        res.send(location);
    });
});

// Weather
app.get('/weather', (req: any, res: any) => {
    weather.getLocation().then( (location) => {
        console.log(location);
        weather.getCurrentConditions(location.longitude, location.latitude).then( (forecast) => {
            res.send(forecast);
        });
    }).catch( (err) => {
        console.log(err);
    });
});

app.get('/weather/:ip', (req: any, res: any) => {
    const data = {
        ip : req.params.ip,
    };
    weather.getLocation(data.ip).then( (location) => {
        console.log(location);
        weather.getCurrentConditions(location.longitude, location.latitude).then( (forecast) => {
            res.send(forecast);
        });
    }).catch( (err) => {
        console.log(err);
    });
});

// Currency
app.get('/currency', (req: any, res: any) => {
     // currency.getRate(100, 'SEK');
});

app.get('/currency/latest', (req: any, res: any) => {
    currency.getLatestRates().then( (resp) => {
        res.send(resp);
    });
});

app.get('/currency/pref/remove/{currency}', (req: any, res: any) => {

    res.send('Currency preference removed');
});

app.get('/currency/getrate/:destcur/:sourcecur/', (req: any, res: any) => {
    const  data = {
        currencies: {
            destcur: req.params.destcur,
            sourcecur: req.params.sourcecur,
        },
    };
    const response = currency.getRateDefault(data.currencies.destcur, data.currencies.sourcecur);
    if (response) {
        const responsedata = {
            base: '100 ' + data.currencies.sourcecur,
            conversions: response,
        };
        res.send(responsedata);
    }
});

app.get('/currency/getrate/:amount/:destcur/:sourcecur/', (req: any, res: any) => {
    const data = {
        currencies: {
            amount: req.params.amount,
            destcur: req.params.destcur,
            sourcecur: req.params.sourcecur,
        },
    };
    const response = currency.getRate(data.currencies.amount, data.currencies.destcur, data.currencies.sourcecur);
    if (response) {
        const responsedata = {
            base: data.currencies.amount + ' ' + data.currencies.sourcecur,
            conversions: response,
        };
        res.send(responsedata);
    }
});

app.get('/currency/getrate/', (req: any, res: any) => {
     currency.getPreferences().then( (pref) => {
        if (pref) {
            const response = currency.getRateFromPreferences(pref);
            if (response) {
                const data = {
                    base: pref.defaultamount + ' ' + pref.base,
                    conversions: response,
                };
                res.send(data);
            }
        }
     });
});

app.get('/currency/pref/read', (req: any, res: any) => {
        res.send(currency.getPreferences());
});

app.listen(3000, () => console.log('Universal API listening on port 3000!'));
