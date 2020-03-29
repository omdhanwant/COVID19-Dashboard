import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardTableComponent } from './dashboard-table/dashboard-table.component';
import { DashboardServiceService } from './services/dashboard-service.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SideListComponent } from './side-list/side-list.component';
import { FilterPipe } from './directives/filterPipe';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { CountryDetailComponent } from './country-detail/country-detail.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    AppComponent,
    DashboardTableComponent,
    DashboardComponent,
    SideListComponent,
    FilterPipe,
    CountryDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.doubleBounce,
      fullScreenBackdrop: true,
      primaryColour: '#6166a1',
      backdropBackgroundColour: 'rgba(172, 166, 166, 0.2)'
    }),
    BsDatepickerModule.forRoot()
  ],
  providers: [
    DashboardServiceService,
    FilterPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
