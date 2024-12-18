import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Metrics } from 'src/app/objets/metrics';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { CommonModule } from '@angular/common';
import { MesConstants } from 'src/app/services/MesConstants';

interface topcards {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule,CommonModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent implements OnInit {
  loading: boolean = true;

  constructor( private http: HttpClient,
    private jwt: TokenStorageService,
    private _snackBar: MatSnackBar) {}


  ngOnInit(): void {
    this.loading = true
    this.jwt.logInCheck();
    this.http.get<Metrics>(MesConstants.LOCALAHOST + "/metrics/getMetrics", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.topcards.find(obj => obj.id === 1)!.subtitle = x.projetsTF + " Projet(s)";
        this.topcards.find(obj => obj.id === 2)!.subtitle = x.projetsConso + " Projet(s)";
        this.topcards.find(obj => obj.id === 3)!.subtitle = x.projetsCompta + " Projet(s)";
        this.bottomCards.find(obj => obj.id === 1)!.subtitle = x.projetsOperation + " Projet(s)";
        this.bottomCards.find(obj => obj.id === 2)!.subtitle = x.projetsPilotage + " Projet(s)";
        this.bottomCards.find(obj => obj.id === 3)!.subtitle = x.projetsRisque + " Projet(s)";
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

  topcards: topcards[] = [
    {
      id: 1,
      color: 'primary',
      icon: 'material-symbols:finance-mode-rounded',
      title: 'Transf. Fin',
      subtitle: '0 Projet(s)',
    },
    {
      id: 2,
      color: 'warning',
      icon: 'oui:app-reporting',
      title: 'Conso & Report',
      subtitle: '0 Projet(s)',
    },
    {
      id: 3,
      color: 'accent',
      icon: 'qlementine-icons:money-16',
      title: 'Compta- Fisc',
      subtitle: '0 Projet(s)',
    }
  ];

  bottomCards: topcards[] = [
    {
      id: 1,
      color: 'error',
      icon: 'fluent-mdl2:manager-self-service',
      title: 'Financial Services',
      subtitle: '0 Projet(s)',
    },
    {
      id: 2,
      color: 'success',
      icon: 'eos-icons:performance',
      title: 'Pilotage & Performance',
      subtitle: '0 Projet(s)',
    },
    {
      id: 3,
      color: 'accent',
      icon: 'ic:outline-other-houses',
      title: 'Risque et Actuariat',
      subtitle: '0 Projet(s)',
    }
  ];
}
