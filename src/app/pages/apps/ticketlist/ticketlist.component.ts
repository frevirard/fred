import { Employee } from './../../datatable/kichen-sink/kichen-sink';
import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable, startWith, map } from 'rxjs';
import { State } from '../../forms/form-elements';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MatSnackBar} from '@angular/material/snack-bar';

export interface TicketElement {
  id?: number;
  titre: string;
  categorie:string;
  details: string;
  assignee: string;
  support:string;
  imgSrc: string;
  statu: string;
  dateDebut: any;
  progression:number;
  nbJour:number;
  pole:string;
  commentaire:string;
}




@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticketlist.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class AppTicketlistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;
  employees: any[] = []
  tickets: TicketElement[] = [

  ];

  displayedColumns: string[] = [
    'titre',
    'categorie',
    'assignee',
    'status',
    'progression',
    'date',
    'action',
  ];

  dataSource = new MatTableDataSource(this.tickets);
  loading = true;
  loadingBis = true;


  constructor(public dialog: MatDialog,private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadingBis = true;
    this.jwt.logInCheck();
    // recuperer la liste des consultants
    this.http.get<Employee[]>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/employee/getAll" ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => { this.employees= x;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
            this._snackBar.open("Echec Récupération liste des consultants", "502", {
              duration: 2000
            })
          }
        })

    // recuperer la liste des actions
    this.http.get<TicketElement[]>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/actions/getAll" ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {
            this.tickets= x;
            this.dataSource = new MatTableDataSource(this.tickets);
            this.totalCount = this.dataSource.data.length;
            this.Open = this.getNbOccur("Ouvert",this.dataSource.data);
            this.Closed = this.getNbOccur("Cloture",this.dataSource.data)
            this.Inprogress = this.getNbOccur("En cours",this.dataSource.data)
            // this.Open = this.btnCategoryClick('Ouvert');
            // this.Closed = this.btnCategoryClick('Cloture');
            // this.Inprogress = this.btnCategoryClick('En cours');
            this.btnCategoryClick('');
            this.dataSource.paginator = this.paginator;
            this.loadingBis = false;
          },
          error: (err) => {
            console.log(err);
            this.loadingBis = false;
            this._snackBar.open("Echec Récupération liste des tickets", "502", {
              duration: 2000
            })
          }
        })
  }

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.tickets);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    let employees = this.employees
    obj.action = action;
    const dialogRef = this.dialog.open(AppTicketDialogContentComponent, {
      data: { obj, employees }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }
  // tslint:disable-next-line - Disables all
  addRowData(row_obj: TicketElement): void {
    const d = new Date();
    this.dataSource.data.unshift({
      id: row_obj.id,
      categorie: row_obj.categorie,
      titre: row_obj.titre,
      details: row_obj.details,
      assignee: row_obj.assignee,
      imgSrc: row_obj.imgSrc,
      pole: row_obj.pole,
      nbJour: row_obj.nbJour,
      statu: row_obj.statu,
      dateDebut: row_obj.dateDebut,
      progression: row_obj.progression,
      support: row_obj.support,
      commentaire: row_obj.commentaire
    });

    this.totalCount = this.dataSource.data.length;
    this.Open = this.getNbOccur("Ouvert",this.dataSource.data);
    this.Closed = this.getNbOccur("Cloture",this.dataSource.data)
    this.Inprogress = this.getNbOccur("En cours",this.dataSource.data)
    this.dataSource = new MatTableDataSource(this.tickets);
    this.table.renderRows();
  }

  getNbOccur(id:string, arr:any[]) {
    var occurs = 0;

    for (var i=0; i<arr.length; i++) {
      if ( 'id' in arr[i] && arr[i].statu === id ) occurs++;
    }

    return occurs;
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: TicketElement): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      if (value.id === row_obj.id) {
        value.categorie= row_obj.categorie,
        value.titre= row_obj.titre,
        value.details= row_obj.details,
        value.assignee= row_obj.assignee,
        value.imgSrc= row_obj.imgSrc,
        value.pole= row_obj.pole,
        value.nbJour= row_obj.nbJour,
        value.statu= row_obj.statu,
        value.dateDebut= row_obj.dateDebut,
        value.progression= row_obj.progression,
        value.support= row_obj.support,
        value.commentaire= row_obj.commentaire
      }

      this.totalCount = this.dataSource.data.length;
      this.Open = this.getNbOccur("Ouvert",this.dataSource.data);
      this.Closed = this.getNbOccur("Cloture",this.dataSource.data)
      this.Inprogress = this.getNbOccur("En cours",this.dataSource.data)
      this.dataSource = new MatTableDataSource(this.tickets);
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: TicketElement): boolean | any {

    this.http.delete("https://mighty-spire-20794-8f2520df548f.herokuapp.com/actions/delete/" + row_obj.id ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {
            this.dataSource.data = this.dataSource.data.filter((value, key) => {
              return value.id !== row_obj.id;
            });
            this.totalCount = this.dataSource.data.length;
            this.Open = this.getNbOccur("Ouvert",this.dataSource.data);
            this.Closed = this.getNbOccur("Cloture",this.dataSource.data);
            this.Inprogress = this.getNbOccur("En cours",this.dataSource.data);

            // this.dataSource = new MatTableDataSource(this.tickets);
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

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'ticket-dialog-content.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
// tslint:disable-next-line - Disables all
export class AppTicketDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  employees:any[];

  stateCtrl = new FormControl('');
  assistCtrl = new FormControl('');

  filteredSEmployee: Observable<any[]>;
  filteredSEmployeeBis: Observable<any[]>;

  constructor(
    private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService,
    public dialogRef: MatDialogRef<AppTicketDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ,private _formBuilder: FormBuilder
  ) {

    this.filteredSEmployee = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filteredSEmployee(state) : this.employees.slice()))
    );

    this.filteredSEmployeeBis = this.assistCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filteredSEmployeeBis(state) : this.employees.slice()))
    );

    this.local_data = { ...data.obj };
    this.employees = data.employees;
    this.action = this.local_data.action;
  }
  ngOnInit(): void {
    console.log(this.local_data)
  }

  private _filteredSEmployee(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter((employee) =>
      employee.nomComplet.toLowerCase().includes(filterValue)
    );
  }

  private _filteredSEmployeeBis(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter((employee) =>
      employee.nomComplet.toLowerCase().includes(filterValue)
    );
  }

  doAction(): void {
    console.log(this.local_data);
    this.http.post<Employee>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/actions/add" ,this.local_data,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => { this.local_data= x;
                         this.dialogRef.close({ event: this.action, data: this.local_data });
          },
          error: (err) => {
            console.log(err);

            this._snackBar.open("Echec ajout consultant", "502", {
              duration: 2000
            })
          }
        })

  }

  updatePicture(employee:any) {
    this.local_data.pole = employee.pole
    this.local_data.imgSrc = employee.avatar;
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
