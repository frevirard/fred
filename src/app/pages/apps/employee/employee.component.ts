import {
  Component,
  Inject,
  Optional,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppAddEmployeeComponent } from './add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';

export interface Employee {
  id: number;
  Name: string;
  Position: string;
  Email: string;
  Mobile: number;
  DateOfJoining: Date;
  Salary: string;
  Projects: number;
  imagePath: string;
}

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
  templateUrl: './employee.component.html',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    MatNativeDateModule,
    DatePipe,
  ],
  providers: [DatePipe],
})
export class AppEmployeeComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  searchText: any;
  displayedColumns: string[] = [
    '#',
    'name',
    'email',
    'mobile',
    'date of joining',
    'salary',
    'projects',
    'action',
  ];
  dataSource = new MatTableDataSource(employees);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

  constructor(public dialog: MatDialog, public datePipe: DatePipe) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppEmployeeDialogContentComponent, {
      data: obj,
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
  addRowData(row_obj: Employee): void {
    this.dataSource.data.unshift({
      id: employees.length + 1,
      Name: row_obj.Name,
      Position: row_obj.Position,
      Email: row_obj.Email,
      Mobile: row_obj.Mobile,

      DateOfJoining: row_obj.DateOfJoining,
      Salary: row_obj.Salary,
      Projects: row_obj.Projects,
      imagePath: row_obj.imagePath,
    });
    this.dialog.open(AppAddEmployeeComponent);
    this.table.renderRows();
  }

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      if (value.id === row_obj.id) {
        value.Name = row_obj.Name;
        value.Position = row_obj.Position;
        value.Email = row_obj.Email;
        value.Mobile = row_obj.Mobile;
        value.DateOfJoining = row_obj.DateOfJoining;
        value.Salary = row_obj.Salary;
        value.Projects = row_obj.Projects;
        value.imagePath = row_obj.imagePath;
      }
      return true;
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'employee-dialog-content.html',
  providers: [DatePipe],
})
// tslint:disable-next-line: component-class-suffix
export class AppEmployeeDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  selectedImage: any = '';

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<AppEmployeeDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.local_data.imagePath === undefined) {
      this.local_data.imagePath = 'assets/images/profile/user-1.jpg';
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
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
