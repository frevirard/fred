import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, startWith, map } from 'rxjs';
import { MesConstants } from 'src/app/services/MesConstants';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { Employee } from '../../employee/employee.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-associe',
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
  templateUrl: './associe.component.html',
  styleUrl: './associe.component.scss'
})
export class AssocieComponent {
  action: string;
  avatars: any[] = ['assets/images/profile/user-0-0.jpg','assets/images/profile/user-0.jpg','assets/images/profile/user-1.jpg', 'assets/images/profile/user-2.jpg', 'assets/images/profile/user-3.jpg'
    , 'assets/images/profile/user-4.jpg', 'assets/images/profile/user-5.jpg', 'assets/images/profile/user-6.jpg', 'assets/images/profile/user-7.jpg',
    'assets/images/profile/user-8.jpg', 'assets/images/profile/user-9.jpg', 'assets/images/profile/user-10.jpg'
  ]

  filteredsAvatar: Observable<any[]>;
  stateCtrl = new FormControl('');
  local_data: any;

  constructor(
    public datePipe: DatePipe,
    private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet,
    private http: HttpClient, private jwt: TokenStorageService,
    public dialogRef: MatDialogRef<AssocieComponent>,
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

  public _filteredAvatar(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.avatars.filter((avatar) =>
      avatar.toLowerCase().includes(filterValue)
    );
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
    this.local_data.nomComplet = this.local_data.nom + " " + this.local_data.prenoms;
    console.log(this.local_data);
    this.http.post<any>(MesConstants.LOCALAHOST + "/donneurOrdre/add", this.local_data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        this.local_data = x;
        console.log("this save" , x);
        this.dialogRef.close({ event: this.action, data: this.local_data });
      },
      error: (err) => {
        console.log(err);

        this._snackBar.open("Echec ajout donneur d'ordre", "502", {
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
      this.local_data.imagePath = reader.result;
    };
  }



}
