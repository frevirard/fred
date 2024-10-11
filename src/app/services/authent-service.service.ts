import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from './authent/utilisateur';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthentServiceService {

  constructor(private http: HttpClient) { }

  login(utilisateur:Utilisateur): Observable<any> {
    return this.http.post("https://mighty-spire-20794-8f2520df548f.herokuapp.com"+ '/auth/signin', {
      username: utilisateur.userName,
      password: utilisateur.passWord
    }, httpOptions);
  }
}
