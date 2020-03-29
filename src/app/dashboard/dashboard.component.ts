import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../services/dashboard-service.service';
import { take } from "rxjs/operators";
import { GlobalData } from '../models/globalData';
import { environment } from 'src/environments/environment';
const countryData = environment.countries;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean = true;
  view: any[] = [900, 500];

  // options
  data: any[];
  pieData: any[];
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = ''//'Metrics';
  yAxisLabel: string = 'Confirmed Cases' //'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  globalData: GlobalData
  constructor(private service: DashboardServiceService) {
    this.globalData = null;
   }

  ngOnInit() {
    this.loading = true;
    this.service.getGlobalCount().pipe(take(1)).subscribe((response: GlobalData) => 
    {this.globalData = response},(error) => this.loading = false);
    this.service.getAllCountriesCount().pipe(take(1)).subscribe(response => {
      this.loading = false;
      this.data =  this.generateData(response['result'])
      this.pieData =  this.generatePieChartData(response['result'])
    },(error) => this.loading = false);
  }

  axisYFormat(val) {
    return val.toLocaleString() + ' people'
  }


  generateData(arr) {
    let countries = [];
    arr.forEach((data) => {
      countries.push({
        name: this.getCountryNameByCode(Object.keys(data)[0])? this.getCountryNameByCode(Object.keys(data)[0]): '',
        series: [
          {
            "name": "Confirmed",
            "value": data[Object.keys(data)[0]].confirmed
          },
          {
            "name": "Deaths",
            "value": data[Object.keys(data)[0]].deaths
          },
          {
            "name": "Recovered",
            "value": data[Object.keys(data)[0]].recovered
          }
        ]
      });

    });
    return countries
  }

  generatePieChartData(arr) {
    let countries = [];
    arr.forEach((data) => {
      countries.push({
        name: this.getCountryNameByCode(Object.keys(data)[0])? this.getCountryNameByCode(Object.keys(data)[0]): '',
        value: data[Object.keys(data)[0]].confirmed
      });
    });
    return countries
  }


  getCountryNameByCode(code): Object {
    const data = countryData.find(country => country['alpha3Code'] == code)
    if(data) {
      return data['name'];
    }
    return '';
  }


  refresh() {
    this.ngOnInit();
  }

}
