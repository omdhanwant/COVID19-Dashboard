import { Component } from '@angular/core';
import { DashboardServiceService } from './services/dashboard-service.service';
import { FilterPipe } from './directives/filterPipe';
import { take } from "rxjs/operators";
import { environment } from 'src/environments/environment';
const countryData = environment.countries;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  allCountriesData: any[];

allCountries: string[];

  constructor(public service: DashboardServiceService, private filter: FilterPipe) { 
    this.allCountriesData = [];
    this.allCountries = [];
  }
  ngOnInit() {
    this.allCountriesData = [];
    this.allCountries = [];

    this.service.getAllCountriesCount().pipe(take(1)).subscribe((response) =>  {
      this.allCountriesData = response['result'];
      this.allCountries = this.generateData(this.allCountriesData); 
    })
  
  }

  generateData(arr) {
    let countries = [];
    arr.forEach((data) => {
      countries.push({
        name: this.getCountryNameByCode(Object.keys(data)[0])? this.getCountryNameByCode(Object.keys(data)[0])['name'] : '',
        code: Object.keys(data)[0],
        flag: this.getCountryNameByCode(Object.keys(data)[0])? this.getCountryNameByCode(Object.keys(data)[0])['flag'] : '',
        confirmed:data[Object.keys(data)[0]].confirmed,
      });

    });
    return countries
  }


  getCountryNameByCode(code): Object {
    return countryData.find(country => country['alpha3Code'] == code);
  }
}
