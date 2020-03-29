import { Component, OnInit, Input } from '@angular/core';
import { DashboardServiceService } from '../services/dashboard-service.service';
import { GlobalData } from '../models/globalData';
import { take } from "rxjs/operators";
import { FilterPipe } from '../directives/filterPipe';
import { environment } from 'src/environments/environment';
// const countryData = require('../../assets/country-codes.json');
 const countryData = environment.countries;



@Component({
  selector: 'app-side-list',
  templateUrl: './side-list.component.html',
  styleUrls: ['./side-list.component.css']
})
export class SideListComponent implements OnInit {
  @Input('response') allCountriesData:any[];
  @Input('data') allCountries:string[];

  // allCountriesData: any[];
  search: string;
  isNav = false;

// allCountries: string[];

  constructor(private service: DashboardServiceService, private filter: FilterPipe) { 
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
    this.allCountriesData.forEach((data) => {
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

  toggle() {
    this.isNav = !this.isNav;
    this.service.isNavToggle = this.isNav;
    if(this.isNav) {
      document.getElementById('container_dash').classList.add('nav-open');
    } else {
      document.getElementById('container_dash').classList.remove('nav-open');
    }
    
  }

}
