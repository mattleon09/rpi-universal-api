import oxr from 'open-exchange-rates';

import fx from 'money';

import fs from 'fs';

import path from 'path';

export class CurrencyExchangeAPI {

    public latestRates: any;

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
        return fx(amount).from(sourcecurrency).to(destinationcurrency);
    }

    public  getPreferences() {
       const filePath  = path.join(__dirname, './currency-preferences.json');
       fs.readFile(filePath, { encoding: 'utf8'}, (err, contents) => {
           console.log(err);
           if (!err) {
            console.log(contents);
           }
        });
    }

}
