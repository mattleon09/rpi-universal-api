import DarkSky from 'darkskyjs';
import ForecastIo from 'forecastio';
import { LocaterAPI } from '../locater_api/locater-api';
import { GeoIpModel } from '../models/geoipmodel';

export class WeatherAPI {

  private darkSky: any;
  private forecastio: any;
  private apiKey: string;
  private locater: LocaterAPI;
  private locationModel: GeoIpModel;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.darkSky = new DarkSky({
      API_KEY: this.apiKey,
    });
    this.forecastio = new ForecastIo(this.apiKey);
    this.locater = new LocaterAPI();

  }
  public async getLocation(ip: string = ''): Promise<GeoIpModel> {
    return await this.locater.getLongLat(ip).then( (loc) => {
      return loc;
    });
  }

  public getFullWeather(longitude: number, latitude: number): Promise<string> {
    const options = {
      units: 'auto',
    };
    return this.getForecast(longitude, latitude, options);
  }

   public getCurrentConditions(longitude: number, latitude: number): Promise<string> {
      const options = {
        exclude: 'hourly,,daily,weekly,flags',
        units: 'auto',
      };
      return this.getForecast(longitude, latitude, options);
  }

  public getForecastToday(longitude: number, latitude: number) {
    const options = {
      exclude: 'weekly,,hourly,currently,flags',
      units: 'auto',
    };
    return this.getForecast(longitude, latitude, options);
  }

  public getForecastWeek(longitude: number, latitude: number) {
    const options = {
      exclude: 'hourly,,daily,currently,flags',
      units: 'auto',
    };
    return this.getForecast(longitude, latitude, options);
  }

  private getForecast(longitude: number, latitude: number, options: any): Promise<string> {
    return this.forecastio.forecast(latitude, longitude, options).then( (data: any) => {
      const json = JSON.stringify(data, null, 2);
      console.log(json);
      return data;
  });
  }
}
