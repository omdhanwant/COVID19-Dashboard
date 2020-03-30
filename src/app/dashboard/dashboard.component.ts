import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../services/dashboard-service.service';
import { take } from "rxjs/operators";
import { GlobalData } from '../models/globalData';
import { environment } from 'src/environments/environment';
const countryData = environment.countries;
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading: boolean = true;
  view: any[] = [900, 500];

  // options
  lineChartdata: any[];
  pieData: any[];
  barGraphData: any[];
  legend: boolean = false;
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
    domain: ['#C7B9B6', '#ACD4DC', '#B4A6C4', '#CA97C7', '#FFA5D2', '#CDCAAD']
  };

  globalData: GlobalData
  date: Date = null;
  maxDate: Date = new Date();
  constructor(private service: DashboardServiceService) {
   }

  ngOnInit() {
    this.loading = true;
    this.globalData = null;
    this.date = null
    this.barGraphData = null;
    this.pieData = null;
    this.lineChartdata = null;
    this.service.getGlobalCount().pipe(take(1)).subscribe((response: GlobalData) => 
    {
      this.globalData = response
      this.date = moment(this.globalData.date).toDate();
      this.maxDate = moment(this.globalData.date).toDate();
    },(error) => this.loading = false);
    
    this.service.getAllCountriesCount().pipe(take(1)).subscribe(response => {
      this.loading = false;
      this.lineChartdata =  this.generateData(response['result'])
      this.pieData =  this.generatePieChartData(response['result'])
    },(error) => this.loading = false);
  }

  getDataByDate() {
    this.pieData = null;
    this.lineChartdata = null;
    this.loading = true;
    this.service.getGlobalCountByDate(moment(this.date).format('YYYY-MM-DD')).pipe(take(1)).subscribe((response: GlobalData) => 
    {
      this.globalData = response
      // this.date = moment(this.globalData.date).toDate();
    },(error) => this.loading = false);
    
    this.service.getGlobalDateWiseCount().pipe(take(1)).subscribe(response => {
      this.loading = false;
      this.barGraphData = this.generateBarChartData(response['result'])
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

  generateBarChartData(arr) {
    let countries = [];
    const len = Object.keys(arr).length
    const index = Object.keys(arr).findIndex(d => d == moment(this.date).format('YYYY-MM-DD'))
    const data = len > 5 ?  Object.keys(arr).slice(index,index + 5) : Object.keys(arr)
    Array.prototype.forEach.call(data, date => {
      countries.push({
        name: date.toString(),
        value: arr[date].confirmed
      });
    })

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
