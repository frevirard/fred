import { Employee } from './../../datatable/kichen-sink/kichen-sink';
import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Observable, startWith, map } from 'rxjs';
import { State } from '../../forms/form-elements';

export interface TicketElement {
  id: number;
  title: string;
  subtext: string;
  assignee: string;
  imgSrc: string;
  status: string;
  date: any;
  progression:number;
}

const tickets: TicketElement[] = [
  {
    id: 1,
    title: 'Support stratégies Data',
    subtext:
      'Support Erudys + MAJ des formats d anciens supports (MAJ 100%)',
    imgSrc: '/assets/images/profile/user-2.jpg',
    assignee: 'Kaxandra LABAT',
    status: 'En cours',
    date: new Date('02/8/2024'),
    progression:40
  },
  {
    id: 2,
    title: 'Suivi des formations Pole',
    subtext:
      'Suivi matrice des compétences',
    assignee: 'GOMEZ Andrew',
    imgSrc: '/assets/images/profile/user-1.jpg',
    status: 'Ouvert',
    date: new Date('03/7/2024'),
    progression:13
  },
  {
    id: 3,
    title: 'Formation ACTIF',
    subtext:
      'Aucune description',
    assignee: 'ABDOULKARIM Cheick',
    imgSrc: '/assets/images/profile/user-3.jpg',
    status: 'Clôturé',
    date: new Date('05/6/2024'),
    progression:0
  },
  {
    id: 4,
    title: 'Formation outil contrôle de gestion',
    subtext:
      'Formation Banque',
    assignee: 'Hermann ZAN',
    imgSrc: '/assets/images/profile/user-1.jpg',
    status: 'En cours',
    date: new Date('06/5/2024'),
    progression:0
  },
  // {
  //   id: 5,
  //   title: 'Elegant Theme Side Menu show OnClick',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'Chris',
  //   imgSrc: '/assets/images/profile/user-5.jpg',
  //   status: 'open',
  //   date: new Date('07/4/2024'),
  // },
  // {
  //   id: 6,
  //   title: 'Header issue in admin pro admin',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'James',
  //   imgSrc: '/assets/images/profile/user-6.jpg',
  //   status: 'closed',
  //   date: new Date('08/3/2024'),
  // },
  // {
  //   id: 7,
  //   title: 'Elegant Theme Side Menu OnClick',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'Jonathan',
  //   imgSrc: '/assets/images/profile/user-7.jpg',
  //   status: 'inprogress',
  //   date: new Date('09/2/2024'),
  // },
  // {
  //   id: 8,
  //   title: 'adminpress Theme Side Menu not opening',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'Smith',
  //   imgSrc: '/assets/images/profile/user-8.jpg',
  //   status: 'open',
  //   date: new Date('10/1/2024'),
  // },
  // {
  //   id: 9,
  //   title: 'Charts not proper in xtreme admin',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'Markus',
  //   imgSrc: '/assets/images/profile/user-9.jpg',
  //   status: 'closed',
  //   date: new Date('11/30/2024'),
  // },
  // {
  //   id: 10,
  //   title: 'Psd not availabel with package',
  //   subtext:
  //     'ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos',
  //   assignee: 'Jane',
  //   imgSrc: '/assets/images/profile/user-10.jpg',
  //   status: 'closed',
  //   date: new Date('12/30/2024'),
  // },
];

const employees = [
  {
    id: 1,
    Name: 'Kaxandra LABAT',
    Position: 'Consultant Junior',
    Email: 'Labat.kaxandra@lendys.com',
    Mobile: 9786838,
    DateOfJoining: new Date('01-2-2020'),
    Salary: "Transfo Finance",
    Projects: 10,
    imagePath: 'assets/images/profile/user-2.jpg',
  },
  {
    id: 2,
    Name: 'Mohamed MENAOUI',
    Position: 'Consultant Data',
    Email: 'M.OUI@lendys.com',
    Mobile: 8786838,
    DateOfJoining: new Date('04-2-2020'),
    Salary: "Compta",
    Projects: 10,
    imagePath: 'assets/images/profile/user-3.jpg',
  },
  {
    id: 2,
    Name: 'Coulibaly Zagnon',
    Position: 'Senior Consultant',
    Email: 'Coulibaly.Zagnon@lendys.com',
    Mobile: 8786838,
    DateOfJoining: new Date('04-2-2020'),
    Salary: "Consolidation",
    Projects: 10,
    imagePath: 'assets/images/profile/user-3.jpg',
  },
  {
    id: 2,
    Name: 'Frederic Edem EKEWOU',
    Position: 'Senior Consultant',
    Email: 'frederic.ekewou@lendys.com',
    Mobile: 8786838,
    DateOfJoining: new Date('04-2-2020'),
    Salary: "Transfo Finance",
    Projects: 10,
    imagePath: 'assets/images/profile/user-3.jpg',
  }

];

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticketlist.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
})
export class AppTicketlistComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;

  displayedColumns: string[] = [
    'id',
    'title',
    'assignee',
    'status',
    'progression',
    'date',
    'action',
  ];
  dataSource = new MatTableDataSource(tickets);


  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.totalCount = this.dataSource.data.length;
    this.Open = this.btnCategoryClick('Ouvert');
    this.Closed = this.btnCategoryClick('Clôturé');
    this.Inprogress = this.btnCategoryClick('En cours');
    this.dataSource = new MatTableDataSource(tickets);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppTicketDialogContentComponent, {
      data: { obj, employees}
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
  addRowData(row_obj: TicketElement): void {
    const d = new Date();
    this.dataSource.data.unshift({
      id: d.getTime(),
      title: row_obj.title,
      subtext: row_obj.subtext,
      assignee: row_obj.assignee,
      imgSrc: '/assets/images/profile/user-1.jpg',
      status: row_obj.status,
      date: row_obj.date,
      progression:row_obj.progression
    });
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: TicketElement): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      if (value.id === row_obj.id) {
        value.title = row_obj.title;
        value.subtext = row_obj.subtext;
        value.assignee = row_obj.assignee;
        value.status = row_obj.status;
        value.date = row_obj.date;
        value.progression = row_obj.progression;
        value.imgSrc = row_obj.imgSrc;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: TicketElement): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value, key) => {
      return value.id !== row_obj.id;
    });
  }
}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'ticket-dialog-content.html',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
// tslint:disable-next-line - Disables all
export class AppTicketDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  employees:any[];

  stateCtrl = new FormControl('');

  filteredSEmployee: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<AppTicketDialogContentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any ,private _formBuilder: FormBuilder
  ) {

    this.filteredSEmployee = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map((state) => (state ? this._filteredSEmployee(state) : this.employees.slice()))
    );

    this.local_data = { ...data.obj };
    this.employees = data.employees;
    console.log (data)
    this.action = this.local_data.action;
  }

  private _filteredSEmployee(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.employees.filter((employee) =>
      employee.Name.toLowerCase().includes(filterValue)
    );
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  updatePicture(imagePath:string) {
    this.local_data.imgSrc = imagePath;
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
