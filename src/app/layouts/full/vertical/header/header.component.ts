import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { Subscription } from 'rxjs';

interface notifications {
  id: number;
  icon: string;
  color: string;
  title: string;
  time: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  title: string;
  link: string;
  new?: boolean;
}

interface apps {
  id: number;
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  link: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  public selectedLanguage: any = {
    language: 'Français',
    code: 'fr',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-fr.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];
  checkConnectStatue: Subscription | undefined;
  isConnected:boolean =false;
  username:string = '';
  nom:string = '';
  prenom:string = '';
  avatar:string = '';



  constructor(
    private settings: CoreService,
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private jwtService: TokenStorageService
  ) {
    translate.setDefaultLang('en');
  }
  ngOnInit(): void {
    this.jwtService.logInCheck();
    if(!this.jwtService.tokenExpired(this.jwtService.getToken()!)) {
      this.jwtService.connectStatut();
      this.jwtService.getToken;
      this.username = this.jwtService.getUser().userName;
      this.nom = this.jwtService.getUser().nom;
      this.prenom = this.jwtService.getUser().prenom;
      this.avatar = this.jwtService.getUser().avatar;

      this.checkConnectStatue = this.jwtService.currentSatue.subscribe(x=> {
        this.isConnected = x;
      })
    }
  }

  options = this.settings.getOptions();

  ngOnDestroy() {
    // this.checkConnectStatue!.unsubscribe();
  }

  logout() {
    this.jwtService.signOut()
    this.isConnected = false;
    window.location.reload();
  }


  setDark() {
    this.settings.toggleTheme();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
    console.log(lang)
  }

  notifications: notifications[] = [
    {
      id: 1,
      icon: 'a-b-2',
      color: 'primary',
      time: '8:30 AM',
      title: 'Launch Admin',
      subtitle: 'Just see the my new admin!',
    },
    {
      id: 2,
      icon: 'calendar',
      color: 'accent',
      time: '8:21 AM',
      title: 'Event today',
      subtitle: 'Just a reminder that you have event',
    },
    {
      id: 3,
      icon: 'settings',
      color: 'warning',
      time: '8:05 AM',
      title: 'Settings',
      subtitle: 'You can customize this template',
    },
    {
      id: 4,
      icon: 'a-b-2',
      color: 'success',
      time: '7:30 AM',
      title: 'Launch Templates',
      subtitle: 'Just see the my new admin!',
    },
    {
      id: 5,
      icon: 'exclamation-circle',
      color: 'error',
      time: '7:03 AM',
      title: 'Event tomorrow',
      subtitle: 'Just a reminder that you have event',
    },
  ];

  profiledd: profiledd[] = [
    {
      id: 1,
      title: 'Tableau de bord',
      link: '/',
     },
    // {
    //   id: 2,
    //   title: 'My Subscription',
    //   link: '/',
    // },
    // {
    //   id: 3,
    //   title: 'My Invoice',
    //   new: true,
    //   link: '/',
    // },
    // {
    //   id: 4,
    //   title: ' Account Settings',
    //   link: '/',
    // },
      // {
      //   id: 5,
      //   title: 'Déconnexion',
      //   link: '/authentication/boxed-login',
      // },

  ];

  apps: apps[] = [
    {
      id: 1,
      icon: 'solar:chat-line-line-duotone',
      color: 'primary',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      icon: 'solar:checklist-minimalistic-line-duotone',
      color: 'accent',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    },
    {
      id: 3,
      icon: 'solar:bill-list-line-duotone',
      color: 'success',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      icon: 'solar:calendar-line-duotone',
      color: 'error',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      icon: 'solar:smartphone-2-line-duotone',
      color: 'warning',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      icon: 'solar:ticket-line-duotone',
      color: 'primary',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      icon: 'solar:letter-line-duotone',
      color: 'accent',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      icon: 'solar:book-2-line-duotone',
      color: 'warning',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];
}

@Component({
  selector: 'search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
  templateUrl: 'search-dialog.component.html',
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });


}
