import { Event } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AppEmployeeDialogContentComponent, Employee } from '../employee/employee.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MatPaginator } from '@angular/material/paginator';
import { MesConstants } from 'src/app/services/MesConstants';
import { AppAddEmployeeComponent } from '../employee/add/add.component';
import { ActionDialogComponent } from './action-dialog/action-dialog.component';
import { AssocieComponent } from './associe/associe.component';

interface Action {
  id: number;
  titre: string;
  description: string;
  categorie:string;
  notification: boolean;
  donneurOrdre: string;
  avatar?:string;
}



interface Ordonneur{
  id: number;
  nom: string;
  prenoms: string;
  email: string;
  pole: string;
  nomComplet:string;
  avatar?:string;
}


@Component({
  selector: 'app-action-board',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    DatePipe // Ajouter DatePipe aux providers
  ],
  templateUrl: './action-board.component.html',
  styleUrl: './action-board.component.scss'
})





export class ActionBoardComponent implements AfterViewInit,OnInit {

  // @ViewChild(MatTable, { static: true }) table: MatTable<any> =
  //   Object.create(null);


  @ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

selection:string = "Action";

loading = true;
loadingDonneur = true;
actions: Action[] = []
donneurs: Ordonneur[] = []
displayedColumns: string[] = [
  'titre',
  'categorie',
  'donneur',
  'notification',
  'action'
];
displayedColumnsDeux: string[] = [
  'nom',
  // 'prenoms',
  'email',
  'action'
];


dataSource = new MatTableDataSource(this.actions);
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

dataSourceDeux = new MatTableDataSource(this.donneurs);
    @ViewChild(MatPaginator, { static: true }) paginatorDeux: MatPaginator =
        Object.create(null);

@ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>;

constructor(public dialog: MatDialog,
  public datePipe: DatePipe,
  private _snackBar: MatSnackBar,
  private http: HttpClient,
  private jwt: TokenStorageService) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadingDonneur = true;
    this.http.get<Ordonneur[]>(MesConstants.LOCALAHOST +"/donneurOrdre/getAll", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.donneurs = x.sort((a, b) => {
          if (a.nom < b.nom) {
            return -1;
          }
          if (a.nom > b.nom) {
            return 1;
          }
          return 0;
        });
        this.dataSourceDeux = new MatTableDataSource(this.donneurs);
        //this.dataSourceDeux.paginator = this.paginatorDeux;
        const paginatorArray = this.paginators.toArray();
        this.dataSourceDeux.paginator = paginatorArray[1];
        this.loadingDonneur = false;
      },

      error: (err) => {
        this.loadingDonneur = false;
        this._snackBar.open("Echec Récupération liste", "502", {
          duration: 2000
        })
      }
    })



    this.http.get<Action[]>(MesConstants.LOCALAHOST +"/action/getAll", {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.actions= x.sort((a, b) => {
          if (a.titre < b.titre) {
            return -1;
          }
          if (a.titre > b.titre) {
            return 1;
          }
          return 0;
        });
        this.dataSource = new MatTableDataSource(this.actions);
        const paginatorArray = this.paginators.toArray();
        this.dataSource.paginator = paginatorArray[0];
        this.loading = false;
      },

      error: (err) => {
        this.loading = false;
        this._snackBar.open("Echec Récupération liste", "502", {
          duration: 2000
        })
      }
    })


  }



  ngAfterViewInit(): void {
     const paginatorArray = this.paginators.toArray();
     // Assign each paginator to its respective data source
     this.dataSource.paginator = paginatorArray[0];
     this.dataSourceDeux.paginator = paginatorArray[1];
  }


[x: string]: any;


refreshTable(index: number) {
  const tablesArray = this.tables.toArray();
  if (tablesArray[index]) {
    // Trigger table rendering
    tablesArray[index].renderRows();
  }
}

onTabChange(event: MatTabChangeEvent) {
  if(event.index ==0 ) {
    this.selection = "Action"
  }

  if(event.index == 1) {
    this.selection = "Associé"
  }
  }

  openDialog(action: string, obj: any): void {
    let actions = action;
    let donneurs = this.donneurs
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      data: { obj, donneurs,actions }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
        // this.employees.push(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
      // this.dataSource = new MatTableDataSource(this.employees);
      //this.dataSource.paginator = this.paginator;
    });
  }

  openDialogDeux(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AssocieComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowDataDeux(result.data);
        // this.employees.push(result.data);
      } else if (result.event === 'Update') {
        this.updateRowDataDeux(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowDataDeux(result.data);
      }
      // this.dataSource = new MatTableDataSource(this.employees);
      //const paginatorArray = this.paginators.toArray();
      //this.dataSourceDeux.paginator = paginatorArray[1];
    });
  }


  // tslint:disable-next-line - Disables all
  addRowData(row_obj: Action): void {
    console.log(row_obj)
    this.dataSource.data.unshift({
      id: row_obj.id,
      titre: row_obj.titre,
      description : row_obj.description,
      categorie : row_obj.categorie,
      notification : row_obj.notification,
      donneurOrdre : row_obj.donneurOrdre
    });
    // this.dialog.open(ActionBoardComponent);
    // this.table.renderRows();
    //this.dataSource = new MatTableDataSource(this.actions);
    this.refreshTable(0);
    const paginatorArray = this.paginators.toArray();
    // Assign each paginator to its respective data source
    this.dataSource.paginator = paginatorArray[0];
    this.dataSourceDeux.paginator = paginatorArray[1];
  }

  addRowDataDeux(row_obj: Ordonneur): void {
    this.dataSourceDeux.data.unshift({
      id: row_obj.id,
      nom: row_obj.nom,
      prenoms: row_obj.prenoms,
      email:row_obj.email,
      nomComplet:row_obj.nomComplet,
      avatar:row_obj.avatar,
      pole:row_obj.pole

    });
    // this.dialog.open(ActionBoardComponent);
    //this.dataSourceDeux = new MatTableDataSource(this.donneurs);
    this.refreshTable(1);
    const paginatorArray = this.paginators.toArray();
    // Assign each paginator to its respective data source
    this.dataSource.paginator = paginatorArray[0];
    this.dataSourceDeux.paginator = paginatorArray[1];
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Action): boolean | any {
    console.log(row_obj)
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.titre = row_obj.titre;
        value.description = row_obj.description;
        value.categorie = row_obj.categorie;
        value.notification = row_obj.notification;
        value.donneurOrdre = row_obj.donneurOrdre;
      }
      return true;
    });
  }

    // tslint:disable-next-line - Disables all
    updateRowDataDeux(row_obj:Ordonneur ): boolean | any {
      this.dataSourceDeux.data = this.dataSourceDeux.data.filter((value: any) => {
        if (value.id === row_obj.id) {
          value.nom = row_obj.nom;
          value.prenoms = row_obj.prenoms;
          value.pole = row_obj.pole;
          value.email = row_obj.email;
          value.nomComplet = row_obj.nomComplet;
          value.avatar = row_obj.avatar;
        }
        return true;
      });
    }


  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Action): boolean | any {
    console.log(row_obj)
    this.http.delete<String>(MesConstants.LOCALAHOST + "/action/delete/" + row_obj.id, {
      headers: new HttpHeaders({
        'Content-Type': '',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.dataSource.data = this.dataSource.data.filter((value: any) => {
          return value.id !== row_obj.id;
        });
      },
      error: (err) => {
        console.log(err);

        this._snackBar.open("Echec Suppression", "502", {
          duration: 2000
        })
      }
    })
  }



  // tslint:disable-next-line - Disables all
  deleteRowDataDeux(row_obj: Action): boolean | any {
    console.log(row_obj)
    this.http.delete<String>(MesConstants.LOCALAHOST + "/donneurOrdre/delete/" + row_obj.id, {
      headers: new HttpHeaders({
        'Content-Type': '',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.dataSourceDeux.data = this.dataSourceDeux.data.filter((value: any) => {
          return value.id !== row_obj.id;
        });
      },
      error: (err) => {
        console.log(err);

        this._snackBar.open("Echec Suppression", "502", {
          duration: 2000
        })
      }
    })
  }


}
