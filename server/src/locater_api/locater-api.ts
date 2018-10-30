import geoip from 'geoip-lite';
import { GeoIpModel } from '../models/geoipmodel';

import { IpFinder } from './ipfinder';

export class LocaterAPI {
  private ipfinder: IpFinder;

  constructor() {
      this.ipfinder = new IpFinder();
  }

  public async getLongLat(): Promise<GeoIpModel> {
    const ip = await this.ipfinder.getPublicIp();
    const geo = geoip.lookup(ip);
    const model  = new GeoIpModel();
    model.range = geo.range;
    model.ll = geo.ll;
    model.latitude = geo.ll[0];
    model.longitude = geo.ll[1];
    model.country = geo.country;
    model.region = geo.region;
    return model;
  }
}
