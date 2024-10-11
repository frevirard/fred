import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';

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
} from 'ng-apexcharts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/pages/apps/employee/employee.component';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metrics } from 'src/app/objets/metrics';
import { CommonModule } from '@angular/common';

export interface yourperformanceChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
}

interface performanceLists {
  id: number;
  color: string;
  icon: string;
  title: string;
  subtext: string;
}

@Component({
  selector: 'app-your-performance',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule,CommonModule],
  templateUrl: './your-performance.component.html',
})
export class AppYourPerformanceComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public yourperformanceChart!: Partial<yourperformanceChart> | any;
  loading=true;
totalProjet: any;
  constructor( private http: HttpClient,
    private jwt: TokenStorageService,
    private _snackBar: MatSnackBar) {
    this.yourperformanceChart = {
      series: [],
      labels: ['Clôturés', 'En Cours', 'Ouverts'],
      chart: {
        type: 'donut',
        height: 205,
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          offsetY: 10,
          donut: {
            size: '90%',
          },
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
        name: {
          show: false,
        },
      },
      stroke: {
        width: 2,
        colors: 'var(--mdc-elevated-card-container-color)',
      },
      tooltip: {
        fillSeriesColor: false,
      },
      colors: ['rgba(255, 102, 146, 1)', '#f8c20a', '#fff9e5', '#a6f7f5', '#16cdc7'],
      responsive: [
        {
          breakpoint: 1400,
          options: {
            chart: {
              height: 150,
            },
          },
        },
      ],
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.jwt.logInCheck();
    this.http.get<Metrics>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/metrics/getMetrics", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        let perfchart:number[] = [];
        perfchart.push(x.projetOuverts);
        perfchart.push(x.projetsEncours);
        perfchart.push(x.projetsCloture);
        this.yourperformanceChart.series = perfchart;
        this.totalProjet = x.totalProjet;
        this.performanceLists.find(obj => obj.id === 1)!.title = x.projetOuverts + " Projet(s)";
        this.performanceLists.find(obj => obj.id === 2)!.title = x.projetsEncours + " Projet(s)";
        this.performanceLists.find(obj => obj.id === 3)!.title = x.projetsCloture + " Projet(s)";
        this.loading = false;
      },

      error: (err) => {
        this.loading = false;
        this._snackBar.open("Echec Récupération des données", "502", {
          duration: 2000
        })
      }
    })
  }


  performanceLists: performanceLists[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'solar:shop-2-linear',
      title: '- Projets',
      subtext: 'Ouvert(s)',
    },
    {
      id: 2,
      color: 'error',
      icon: 'solar:filters-outline',
      title: '- Projets',
      subtext: 'En Cours',
    },
    {
      id: 3,
      color: 'accent',
      icon: 'solar:pills-3-linear',
      title: '- Projets',
      subtext: 'Clôturé(s)',
    },


  ];
}
