import * as os from 'os';
import publicIp from 'public-ip';

const ifaces = os.networkInterfaces();

export class IpFinder {

    public async getPublicIp(): Promise<string> {
        let returnValue: string;
        await publicIp.v4().then( (ip: any) => {
          returnValue = ip;
        });
        return returnValue;
    }

    public getIp(): void {
        Object.keys(ifaces).forEach((ifname) => {
            let alias = 0;
            ifaces[ifname].forEach((iface) => {
              if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
              }

              if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
              } else {
                // this interface has only one ipv4 adress
                console.log(ifname, iface.address);
              }
              ++alias;
            });
          });

    }
}
