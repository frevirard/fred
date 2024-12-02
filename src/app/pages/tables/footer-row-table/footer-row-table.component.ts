import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MesConstants } from 'src/app/services/MesConstants';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { Employee } from '../../apps/employee/employee.component';
export interface Transaction {
  item: string;
  img: string;
  cost: number;
  moyenne:number;
  color:string
}
@Component({
  selector: 'app-footer-row-table',
  standalone: true,
  imports: [MatTableModule, MatCardModule, CommonModule],
  templateUrl: './footer-row-table.component.html',
  styleUrls: ['./footer-row-table.component.scss'],
})
export class AppFooterRowTableComponent implements OnInit {
  displayedColumns: string[] = ['item', 'cost','average'];
  transactions: Transaction[] = [
    { img: 'eos-icons:project-outlined', item: 'Projet', cost: 0,moyenne:0, color:"primary" },
    { img: 'streamline:global-learning', item: 'Formation', cost: 0,moyenne:0,color:"error"  },
    { img: 'healthicons:healthcare-it', item: 'IT', cost: 0 ,moyenne:0,color:"accent" },
    { img: 'solar:help-bold', item: 'Association', cost: 0 ,moyenne:0,color:"warning" },
    { img: 'gg:phone', item: 'Commerciale', cost: 0,moyenne:0 ,color:"primary" },
    { img: 'material-symbols:e911-emergency-outline', item: 'Urgence', cost: 0 ,moyenne:0 ,color:"error"},
    { img: 'basil:other-1-outline', item: 'Autre', cost: 0 ,moyenne:0 ,color:"accent"},
  ];
  loading: boolean;

  /** Gets the total cost of all transactions. */
  getTotalCost() {
    return this.transactions
      .map((t) => t.cost)
      .reduce((acc, value) => acc + value, 0);
  }

  constructor(public dialog: MatDialog,private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService) {}

  ngOnInit(): void {
    this.loading = true;
    this.jwt.logInCheck();
    // recuperer la liste des consultants
    this.transactions.forEach(transaction=> {
      this.http.get<number>(MesConstants.LOCALAHOST + "/metrics/nbCategorie/" + transaction.item ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
        'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
            next: (x) => {
              transaction.cost = x;
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              this._snackBar.open("Echec Récupération nombre par catégorie", "502", {
                duration: 2000
              })
            }
          })
    })

    this.transactions.forEach(transaction=> {
      this.http.get<number>(MesConstants.LOCALAHOST + "/metrics/moyenneTempsCategorie/" + transaction.item ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
        'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
            next: (x) => {
              if(x>0){transaction.moyenne = x}
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              this._snackBar.open("Echec Récupération moyenne jours", "502", {
                duration: 2000
              })
            }
          })
    })

  }
}
