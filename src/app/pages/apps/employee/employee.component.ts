
import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpHeaders } from '@angular/common/http';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { AuthInterceptor } from 'src/app/services/AuthInterceptor.interceptor';
import { Observable, startWith, map } from 'rxjs';




export interface Employee {
  id?: number;
  nom: string;
  prenoms: string;
  avatar:string;
  pole:string;
  statu:String;
  dateInterco: Date;
  email: string;
  mobile: number;
  carence: string;
  posteOccupe: string;
  projets: number;
  nomComplet:string;
}




@Component({
  templateUrl: './employee.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule,
    DatePipe,
    CommonModule
  ],
  providers: [DatePipe , { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
})
export class AppEmployeeComponent implements AfterViewInit,OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  loading: boolean = true;
  employees:Employee[] = []
  displayedColumns: string[] = [
    'nom',
    'statu',
    'dateInterco',
    'carence',
    'projets',
    'action',
  ];


  dataSource = new MatTableDataSource(this.employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe ,private _formBuilder: FormBuilder, private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,
    private http: HttpClient,private jwt:TokenStorageService) {}
  ngOnInit(): void {
    this.loading = true
    this.jwt.logInCheck();
    this.http.get<Employee[]>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/employee/getAll" ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => { this.employees= x; this.loading = false ; this.dataSource = new MatTableDataSource(this.employees);},
          error: (err) => {
            console.log(err);
            this.loading = false;
            this._snackBar.open("Echec Récupération liste", "502", {
              duration: 2000
            })
          }
        })
      }



  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
      data: obj,
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
  addRowData(row_obj: Employee): void {
    this.dataSource.data.unshift({
      id:row_obj.id,
      nom: row_obj.nom,
      prenoms: row_obj.prenoms,
      avatar:row_obj.avatar,
      pole:row_obj.pole,
      statu:row_obj.statu,
      dateInterco:row_obj.dateInterco,
      mobile: row_obj.mobile,
      email:row_obj.email,
      carence: row_obj.carence,
      posteOccupe: row_obj.posteOccupe,
      projets: row_obj.projets,
      nomComplet: row_obj.nomComplet,

    });
    this.dialog.open(AppAddEmployeeComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.nom = row_obj.nom;
        value.prenoms= row_obj.prenoms;
        value.avatar=row_obj.avatar;
        value.pole=row_obj.pole;
        value.statu = row_obj.statu;
        value.dateInterco =row_obj.dateInterco;
        value.mobile= row_obj.mobile;
        value.email=row_obj.email;
        value.carence= row_obj.carence;
        value.posteOccupe= row_obj.posteOccupe;
        value.projets= row_obj.projets;
        value.nomComplet= row_obj.nomComplet;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Employee): boolean | any {

    this.http.delete<String>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/employee/delete/" + row_obj.id ,{headers:new HttpHeaders({ 'Content-Type': '' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
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
}



@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'employee-dialog-content.html',
  providers: [DatePipe],
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent implements OnInit {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';
  avatars:any[] = ['assets/images/profile/user-1.jpg','assets/images/profile/user-2.jpg','assets/images/profile/user-3.jpg'
    ,'assets/images/profile/user-4.jpg','assets/images/profile/user-5.jpg','assets/images/profile/user-6.jpg','assets/images/profile/user-7.jpg',
    'assets/images/profile/user-8.jpg','assets/images/profile/user-9.jpg','assets/images/profile/user-10.jpg'
  ]
  filteredsAvatar: Observable<any[]>;
  stateCtrl = new FormControl('');

  constructor(
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,
    private http: HttpClient,private jwt:TokenStorageService,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {

    this.filteredsAvatar = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filteredAvatar(state) : this.avatars.slice()))
    );


    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.local_data.avatar === undefined) {
      this.local_data.avatar = 'assets/images/profile/user-1.jpg';
    }
  }


  ngOnInit(): void {
     this.jwt.logInCheck();
  }

  public _filteredAvatar(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.avatars.filter((avatar) =>
      avatar.toLowerCase().includes(filterValue)
    );
  }

  doAction(): void {
    this.local_data.nomComplet = this.local_data.nom + " " + this.local_data.prenoms;
    console.log(this.local_data);
    this.http.post<Employee>("https://mighty-spire-20794-8f2520df548f.herokuapp.com/employee/add" ,this.local_data,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
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

  updatePicture(imagePath:string) {
    this.local_data.avatar = imagePath;
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  selectFile(event: any): void {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
  }
}
