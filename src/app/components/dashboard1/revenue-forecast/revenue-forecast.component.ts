import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexFill,
} from 'ng-apexcharts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MesConstants } from 'src/app/services/MesConstants';

export interface revenueForecastChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  fill: ApexFill;
}

@Component({
  selector: 'app-revenue-forecast',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './revenue-forecast.component.html',
})
export class AppRevenueForecastComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public revenueForecastChart!: Partial<revenueForecastChart> | any;

  loading = true;

  anneeun:string;
  anneedeux:string;
  anneetrois:string;

  constructor(private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService) {
    this.revenueForecastChart = {
      series: [
        {
          name: '2023',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
        },

        {
          name: '2022',
          data: [0,0,0,0,0,0,0,0,0,0,0,0]
        },
        {
          name: '2024',
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
        },
      ],

      chart: {
        type: 'area',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 300,
        width: '100%',
        stacked: false,
        offsetX: -10,
      },
      colors: ['rgb(255, 102, 146)', '#16cdc7', 'rgb(99, 91, 255)'],
      stroke: {
        width: 2,
        curve: 'monotoneCubic',
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: true,
        padding: {
          top: 0,
          bottom: 0,
        },
        borderColor: 'rgba(0,0,0,0.05)',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          inverseColors: false,
          opacityFrom: 0.45,
          opacityTo: 0,
          stops: [20, 180],
        },
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: ['Jan', 'Fev', 'Mar', 'Avril', 'Mai', 'Juin', 'Juil', 'Août','Sept','Oct','Nov','Dec'],
      },
      markers: {
        strokeColor: ['rgba(255, 102, 146, 1)', '#16cdc7', 'rgba(99, 91, 255, 1)'],
        strokeWidth: 2,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }
  ngOnInit(): void {
    this.loading = true;
    this.jwt.logInCheck();
    // recuperer la liste des consultants
    this.http.get<any[]>(MesConstants.LOCALAHOST + "/metrics/historique" ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => { this.revenueForecastChart.series= x;
            this.anneeun = x[1].name;
            this.anneedeux = x[0].name;
            this.anneetrois = x[2].name;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
            this._snackBar.open("Echec Récupération historique des projets", "502", {
              duration: 2000
            })
          }
        });
  }
}
