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
}
@Component({
  selector: 'app-footer-row-table',
  standalone: true,
  imports: [MatTableModule, MatCardModule, CommonModule],
  templateUrl: './footer-row-table.component.html',
  styleUrls: ['./footer-row-table.component.scss'],
})
export class AppFooterRowTableComponent implements OnInit {
  displayedColumns: string[] = ['item', 'cost'];
  transactions: Transaction[] = [
    { img: '/assets/images/products/s1.jpg', item: 'Projet', cost: 0 },
    { img: '/assets/images/products/s2.jpg', item: 'Formation', cost: 0 },
    { img: '/assets/images/products/s3.jpg', item: 'IT', cost: 0 },
    { img: '/assets/images/products/s4.jpg', item: 'Association', cost: 0 },
    { img: '/assets/images/products/s5.jpg', item: 'Commerciale', cost: 0 },
    { img: '/assets/images/products/s6.jpg', item: 'Urgence', cost: 0 },
    { img: '/assets/images/products/s6.jpg', item: 'Autre', cost: 0 },
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
      console.log(MesConstants.LOCALAHOST + "/metrics/nbCategorie/" + transaction.item );
      this.http.get<number>(MesConstants.LOCALAHOST + "/metrics/nbCategorie/" + transaction.item ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
        'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
            next: (x) => {
              transaction.cost = x;
            },
            error: (err) => {
              console.log(err);
              this.loading = false;
              this._snackBar.open("Echec Récupération liste des consultants", "502", {
                duration: 2000
              })
            }
          })
    })

  }
}
