import { Component, OnInit } from '@angular/core';
import { DashboardServiceService } from '../services/dashboard-service.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { take } from "rxjs/operators";
const countryData = environment.countries;
import * as moment from 'moment';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.css']
})
export class CountryDetailComponent implements OnInit {
  loading: boolean = false;
  view: any[] = [900, 500];
  stats:any

  // options
  // data: any[];
  barGraphData: any[];
  legend: boolean = true;
  gradient:boolean = true
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Metrics';
  yAxisLabel: string = 'Confirmed Cases' //'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#C7B9B6', '#ACD4DC', '#B4A6C4', '#CA97C7', '#FFA5D2', '#CDCAAD']
  };
  code: string;
  flag: string;
  date: Date = null;
  alertMessage: string = ''
  showAlert: boolean = false;
  constructor(private service: DashboardServiceService, private route: ActivatedRoute) {
   }

  ngOnInit() {
    this.stats = null;
    // this.data = [];
    this.barGraphData = [];
    this.date = null;

    this.route.queryParamMap.subscribe(param => {
      this.loading = true;
      this.code = param.get('code');
      this.flag = param.get('flag');
      this.service.getLatestCountrySpecificCount(this.code).subscribe(res => {
        const obj = Object.keys(res['result'])[0].toString();
        this.stats = res['result'][obj]
      })
      this.service.getCountrySpecificCount(this.code).subscribe((response) => {
        this.loading = false;
        this.barGraphData = this.generateBarChartData(response['result'])
      },(error)=> this.loading = false)
    })

  }

  axisYFormat(val) {
    return val.toLocaleString() + ' people'
  }

  getDataByDate() {
    this.loading = true;
    this.service.getCountrySpecificCountByDate(this.code,moment(this.date).format('YYYY-MM-DD'))
    .subscribe(res => {
      this.barGraphData = this.generateBarChartData(res['result'])
      this.loading = false
    }, (error)=>{
      this.alertMessage = `No data available for date ${moment(this.date).format('YYYY-MM-DD')}`
      this.showAlert = true;
      setTimeout(() => {
        this.alertMessage = ``;
        this.showAlert = false;
      }, 3000);
      this.loading = false
    })
  }

  // generateData(arr) {
  //   let countries = [];
  //   Object.keys(arr)
  //   Array.prototype.forEach.call(Object.keys(arr).slice(0,6), date => {
  //     countries.push({
  //       name: date.toString(),
  //       series: [
  //         {
  //           "name": "Confirmed",
  //           "value": arr[date].confirmed
  //         },
  //         {
  //           "name": "Deaths",
  //           "value": arr[date].deaths
  //         },
  //         {
  //           "name": "Recovered",
  //           "value": arr[date].recovered
  //         }
  //       ]
  //     });
  //   });

  //   return countries
  // }

  generateBarChartData(arr) {
    let countries = [];
    const len = Object.keys(arr).length
    const data = len > 5 ?  Object.keys(arr).slice(len-6,len) : Object.keys(arr)
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
