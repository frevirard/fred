import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokenStorageService } from './services/tokenStorage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Modernize Angular Admin Tempplate';

  constructor( private jwt: TokenStorageService){

  }

  ngOnInit(): void {
    this.jwt.logInCheck();
  }





}
