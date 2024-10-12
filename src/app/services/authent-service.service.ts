import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from './authent/utilisateur';
import { MesConstants } from './MesConstants';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthentServiceService {

  constructor(private http: HttpClient) { }

  login(utilisateur:Utilisateur): Observable<any> {
    return this.http.post(MesConstants.LOCALAHOST +  '/auth/signin', {
      username: utilisateur.userName,
      password: utilisateur.passWord
    }, httpOptions);
  }
}
