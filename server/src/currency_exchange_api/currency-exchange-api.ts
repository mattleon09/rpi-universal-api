import { Preferences } from './preferences';

import oxr from 'open-exchange-rates';

import fx from 'money';

import * as fs from 'fs';

import * as path from 'path';

export class CurrencyExchangeAPI {

    public latestRates: any;
    public preferences: Preferences;

    private apiKey: string;
    private currencyBase: string =  'USD';
    private requestedSymbols: string = 'SEK,HTG,CAD';
    private baseUrl: string = 'https://openexchangerates.org/api/';
    private apiUrl: string;

    private headers: object;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiUrl = this.baseUrl + 'latest.json?symbols=' + this.requestedSymbols;

        this.headers  = {
            'Authorization': 'Token ' + this.apiKey,
            'Content-Type': 'application/json',
        };

        oxr.set({ app_id: this.apiKey });

        this.getPreferences();
      /*   oxr.latest(() => {
            fx.rates = oxr.rates;
            fx.base = oxr.base;

            const data = fx(100).from('USD').to('SEK');
            console.log(data);
        });
 */
    }

    public initializeFX() {
        fx.rates = this.latestRates.rates;
        fx.base = this.latestRates.base;
    }

    public async getLatestRates() {
        return await oxr.latest( () => {
           return oxr.latest();
        });
    }

    public getRate(amount: number, destinationcurrency: string, sourcecurrency: string  = 'USD') {
        this.initializeFX();
        const results = new Array<any>();
        this.preferences.currencypreferences.forEach( (c: string) => {
            results.push(fx(amount).from(this.preferences.base).to(c));
        });
        console.log(results);
        return results;
    }

    public getRateDefault(destinationcurrency: string, sourcecurrency: string  = 'USD') {
        this.initializeFX();
        return fx(this.preferences.defaultamount).from(sourcecurrency).to(destinationcurrency);
    }

    public getPreferences(): Preferences {
       this.preferences = new Preferences ();
       const filePath  =  __dirname + '/preferences/currency-preferences.json';
       fs.readFile(filePath, { encoding: 'utf8'}, (err: any, contents: any) => {
           if (!err) {
            const data = JSON.parse(contents);
            this.preferences.base = data.base;
            this.preferences.currencypreferences = data.currencypreference;
            this.preferences.defaultamount = data.defaultamount;
           }
        });
       return this.preferences;
    }

}
