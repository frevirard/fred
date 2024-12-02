import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, NgModule, OnInit, Optional } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { map, Observable, startWith } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { MesConstants } from 'src/app/services/MesConstants';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { Employee } from '../../employee/employee.component';

interface Ordonneur{
  id: number;
  nom: string;
  prenoms: string;
  email: string;
  pole: string;
  nomComplet:string;
  avatar?:string;
}

interface Action {
  id: number;
  titre: string;
  description: string;
  categorie:string;
  notification: boolean;
  donneurOrdre: string;
  avatar?:string;
}

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe // Ajouter DatePipe aux providers
  ],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss'
})
export class ActionDialogComponent implements OnInit {

  donneurs:Ordonneur[] = []
  action: string;
  avatars: any[] = ['assets/images/profile/user-0-0.jpg','assets/images/profile/user-0.jpg','assets/images/profile/user-1.jpg', 'assets/images/profile/user-2.jpg', 'assets/images/profile/user-3.jpg'
    , 'assets/images/profile/user-4.jpg', 'assets/images/profile/user-5.jpg', 'assets/images/profile/user-6.jpg', 'assets/images/profile/user-7.jpg',
    'assets/images/profile/user-8.jpg', 'assets/images/profile/user-9.jpg', 'assets/images/profile/user-10.jpg'
  ]

  filteredsAvatar: Observable<any[]>;
  filteredDonneur: Observable<any[]>;
  stateCtrl = new FormControl('');
  local_data: Action;


  constructor(
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,
    private http: HttpClient, private jwt: TokenStorageService,
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    // this.filteredsAvatar = this.stateCtrl.valueChanges.pipe(
    //   startWith(''),
    //   map((state) => (state ? this._filteredAvatar(state) : this.avatars.slice()))
    // );


    this.filteredDonneur = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filteredDonneur(state) : this.donneurs.slice()))
    );



    this.local_data = { ...data.obj };
    this.donneurs = data.donneurs;
    this.action = data.actions;
    console.log(this.donneurs, "hell yeah")
    if (this.local_data.avatar === undefined) {
      this.local_data.avatar = 'assets/images/profile/user-1.jpg';
    }
  }
  ngOnInit(): void {
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

        // this.loading = false;
      },

      error: (err) => {
        // this.loading = false;
        this._snackBar.open("Echec Récupération liste", "502", {
          duration: 2000
        })
      }
    })


  }

  // public _filteredAvatar(value: string): any[] {
  //   const filterValue = value.toLowerCase();

  //   return this.avatars.filter((avatar) =>
  //     avatar.toLowerCase().includes(filterValue)
  //   );
  // }

  public _filteredDonneur(value: string): any[] {
    const filterValue = value.toLowerCase();
    console.log(this.donneurs,"voila")
    return this.donneurs.filter((donneur) =>
      donneur.nomComplet.toLowerCase().includes(filterValue)
    );
  }


  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
    this.local_data.donneurOrdre = this.local_data.donneurOrdre;
    console.log(this.local_data);
    this.http.post<any>(MesConstants.LOCALAHOST + "/action/add", this.local_data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.local_data = x;
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

  updatePicture(imagePath: string) {
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
      // this.local_data.imagePath = reader.result;
    };
  }

}
