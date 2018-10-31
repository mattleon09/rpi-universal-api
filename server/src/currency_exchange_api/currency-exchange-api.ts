import { ConversionResponse } from './conversionresponse';

import { FileReader } from './../utilities/filereader';

import { Preferences } from './preferences';

import oxr from 'open-exchange-rates';

import fx from 'money';

import * as fs from 'fs';

export class CurrencyExchangeAPI {

    public latestRates: any;
    private apiKey: string;
    private currencyBase: string =  'USD';
    private requestedSymbols: string = 'SEK,HTG,CAD';
    private baseUrl: string = 'https://openexchangerates.org/api/';
    private apiUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.apiUrl = this.baseUrl + 'latest.json?symbols=' + this.requestedSymbols;

        oxr.set({ app_id: this.apiKey });

        this.getSampleData();
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

    public async getLatestRates(): Promise<any> {
        this.getSampleData();
        console.log(this.latestRates);
        return this.latestRates;
       /*  return await oxr.latest( () => {
           return oxr.latest();
        }); */
    }

    public getRate(amount: number, destinationcurrency: string, sourcecurrency: string  = 'USD') {
        this.initializeFX();
        const conversion = fx(amount).from(sourcecurrency).to(destinationcurrency);
        const response = new ConversionResponse();
        response.amount = conversion;
        response.currency = destinationcurrency;
        return response;
    }

    public getRateFromPreferences(preferences: Preferences) {
        this.initializeFX();
        const results = new Array<any>();
        const length = preferences.currencypreferences.length;
        for (let i = 0; i < length; i++) {
            const curr = preferences.currencypreferences[i];
            const conversion: number = fx(preferences.defaultamount).from(preferences.base).to(curr);
            const response = new ConversionResponse();

            response.amount = conversion;
            response.currency = curr;
            results.push(response);
        }
        return results;
    }

    public getRateDefault(destinationcurrency: string, sourcecurrency: string  = 'USD') {
        this.initializeFX();
        const conversion = fx(100).from(sourcecurrency).to(destinationcurrency);
        const response = new ConversionResponse();
        response.amount = conversion;
        response.currency = destinationcurrency;
        return response;
    }

    public async getPreferences() {
       let preferences = new Preferences();
       const reader = new FileReader();
       const filePath  =  __dirname + '/preferences/currency-preferences.json';
       const data = await reader.readFile(filePath);
       preferences = JSON.parse(data.toString());
       return preferences;
    }

    private getSampleData() {
            return fs.readFile(__dirname + '/data.json', { encoding: 'utf8'}, (err: any, contents: any) => {
                if (!err) {
                    this.latestRates = JSON.parse(contents);
                    return this.latestRates;
                }
            });
    }

}
