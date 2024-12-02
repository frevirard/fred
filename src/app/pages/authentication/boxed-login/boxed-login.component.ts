import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { Utilisateur } from 'src/app/services/authent/utilisateur';
import { AuthentServiceService } from 'src/app/services/authent-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boxed-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './boxed-login.component.html',
  styleUrls: ['./boxed-login.component.scss'],
})
export class AppBoxedLoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router , private authService: AuthentServiceService, private tokenStorage: TokenStorageService,private _snackBar: MatSnackBar) { }

  utilisateur:Utilisateur = {
    userName: '',
    passWord: '',
    email: '',
    nom:'',
    prenom:'',
    avatar:''
  }
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }



  submit() {
    this.utilisateur.userName = this.form.controls['uname'].value!;
    this.utilisateur.passWord = this.form.controls['password'].value!;
    this.onSubmit()
  }

  onSubmit(): void {

    this.authService.login(this.utilisateur).subscribe(
      (      data: any) => {
        this.tokenStorage.saveToken(data.jwt);
        this.utilisateur.userName = data.userName;
        this.utilisateur.nom = data.nom;
        this.utilisateur.prenom = data.prenoms;
        this.utilisateur.avatar = data.avatar;
        this.utilisateur.passWord = "";
        this.tokenStorage.saveUser(this.utilisateur);
        this.tokenStorage.connectStatut();
        // console.log(data.accessToken);
        // console.log("voici le token");
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this._snackBar.open("Connecté", "", { duration: 2000 })
        this.roles = this.tokenStorage.getUser().roles;
        this.delayedFunction();
        // this.router.navigate(['/dashboards/dashboard1']);

      },
      (      err: { error: { message: string; }; }) => {
        this.errorMessage = err.error.message;
        this._snackBar.open("Mot de passe ou nom d'utilisateur incorrect", "Echec", { duration: 2000 })
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage(): void {
    window.location.reload();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async  delayedFunction() {
    await this.delay(1500); // wait for 2 seconds
    this.router.navigate(['/dashboards/dashboard1']);
  }
}
