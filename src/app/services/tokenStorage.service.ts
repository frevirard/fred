import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Utilisateur } from './authent/utilisateur';
import { HttpHeaders } from '@angular/common/http';


const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';



@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  header:HttpHeaders ;
  private isConnected = new BehaviorSubject(false);
  currentSatue = this.isConnected.asObservable();

  constructor(private router:Router,private _snackBar: MatSnackBar) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public connectStatut() {
    this.isConnected.next(true);
  }

  public disconnectStatut() {
    this.isConnected.next(false);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);

  }

  public getToken() {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(utilisateur: Utilisateur): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(utilisateur));
  }

  public getUser(): any {
    return JSON.parse(window.sessionStorage.getItem(USER_KEY)!);
  }

  public tokenExpired(token: string) {
    if(token ==null) {
      return true;
    }
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    // alert(expiry)
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public logInCheck() {
    if(this.getToken == null  )  {
      this.disconnectStatut();
      this._snackBar.open("Vous n'êtes pas connecté(e)", "Redirection", { duration: 2000 });
      this.router.navigate(["/authentication/boxed-login"]);
    } else if (this.tokenExpired(this.getToken()!)) {
      this.disconnectStatut();
      this._snackBar.open("Vous n'êtes pas connecté(e)", "Redirection", { duration: 2000 });
      this.router.navigate(["/authentication/boxed-login"]);
    }
  }

}
