import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { Observable } from "rxjs/Rx";
import { map } from "rxjs/operators";
import { GlobalData } from '../models/globalData';
@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {
  isNavToggle = false;
  constructor(private httpClient: HttpClient) { }

  getGlobalCount() {
    return this.httpClient.get(`${environment.hostUrl}/api/${environment.version}/global`);
  }

  getAllCountriesCount() {
    return this.httpClient.get(`${environment.hostUrl}/api/${environment.version}/global/latest`);
  }

  getCountrySpecificCount(countryCode) {
    return this.httpClient.get(`${environment.hostUrl}/api/${environment.version}/country/${countryCode}`);
  }

  getCountrySpecificCountByDate(countryCode, date) {
    return this.httpClient.get(`${environment.hostUrl}/api/${environment.version}/country/${countryCode}/${date}`);
  }

  getLatestCountrySpecificCount(countryCode) {
    return this.httpClient.get(`${environment.hostUrl}/api/${environment.version}/country/${countryCode}/latest`);
  }
}
