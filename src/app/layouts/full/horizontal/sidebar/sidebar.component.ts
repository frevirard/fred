import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { navItems } from './sidebar-data';
import { Router } from '@angular/router';
import { NavService } from '../../../../services/nav.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { AppHorizontalNavItemComponent } from './nav-item/nav-item.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';

@Component({
  selector: 'app-horizontal-sidebar',
  standalone: true,
  imports: [AppHorizontalNavItemComponent, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class AppHorizontalSidebarComponent implements OnInit {
  navItems = navItems;
  parentActive = '';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  checkConnectStatue: Subscription | undefined;
  isConnected:boolean =false;
  username:string = ''


  constructor(
    private jwtService: TokenStorageService,
    public navService: NavService,
    public router: Router,
    media: MediaMatcher,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1100px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.router.events.subscribe(
      () => (this.parentActive = this.router.url.split('/')[1])
    );
  }



  ngOnInit() {
    if(!this.jwtService.tokenExpired(this.jwtService.getToken()!)) {
      this.jwtService.connectStatut();
      this.username = this.jwtService.getUser().username;
      this.checkConnectStatue = this.jwtService.currentSatue.subscribe(x=> {
        this.isConnected = x;
      })
    }

  }


  ngOnDestroy() {
    this.checkConnectStatue!.unsubscribe();
  }

  logout() {
    this.jwtService.signOut()
    this.isConnected = false;
    window.location.reload();
  }
}
