import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog.component';
import { OkAppTaskComponent } from './ok-task/ok-task.component';
import { DeleteAppTaskComponent } from './delete-task/delete-task.component';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MesConstants } from 'src/app/services/MesConstants';
import { of } from 'rxjs';

// tslint:disable-next-line - Disables all
// interface todos {
//   id: number;
//   title: string;
//   description: string;
//   class?: string;
// }

export interface Todos {
  id?: number;
  titre: string;
  categorie:string;
  details: string;
  assignee: string;
  support:string;
  imgSrc: string;
  statu: string;
  dateDebut: any;
  progression:number;
  nbJour:number;
  pole:string;
  commentaire:string;
}

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, DragDropModule],
})
export class AppTaskboardComponent implements OnInit {
  todos: Todos[] = [];

  inprogress: Todos[] = [];

  completed: Todos[] = [];

  onhold: Todos[] = [];
  loading =false;

  constructor(public dialog: MatDialog,private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService) {}



  ngOnInit(): void {
    this.loading = true
    this.jwt.logInCheck();
    //recuperer la liste des actions

    // recuperer la liste des actions
    this.http.get<Todos[]>(MesConstants.LOCALAHOST + "/actions/getAll" ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {

            x.forEach(todo=> {
              if(todo.statu=="Ouvert" && todo.progression == 0) {
                this.todos.push(todo);
              }
              else if (todo.statu=="Ouvert" && todo.progression > 0) {
                this.inprogress.push(todo);
              }
              else if (todo.statu=="En cours") {
                this.inprogress.push(todo);
              }
              else if (todo.statu=="Pause" && todo.progression > 0) {
                this.onhold.push(todo);
              }
              else if (todo.statu=="Cloture" && todo.progression > 0) {
                this.completed.push(todo);
              }
            })
            // this.Open = this.btnCategoryClick('Ouvert');
            // this.Closed = this.btnCategoryClick('Cloture');
            // this.Inprogress = this.btnCategoryClick('En cours');

            this.loading = false;
          },
          error: (err) => {
            console.log(err);
            this.loading = false;
            this._snackBar.open("Echec Récupération liste des tickets", "502", {
              duration: 2000
            })
          }
        })


  }

  drop(event: CdkDragDrop<any[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const prevIndex = event.previousIndex;
      const currIndex = event.currentIndex;

      const previousList = event.previousContainer.data;
      const currentList = event.container.data;

      let todo:Todos = currentList[currIndex];

      // Remove item from previous list
      // const [item] = previousList.splice(prevIndex, 1);
      // console.log(item, "item")
      // // Add item to current list
      // currentList.splice(currIndex, 0, item);
      console.log()
      // console.log(event.item.data)
      if(event.container.id == "cdk-drop-list-0") {
        console.log("ouvert")
        todo.statu ="Ouvert";
        todo.progression = 0;
        this.doAction(todo);
      }
      else if(event.container.id == "cdk-drop-list-1") {
        console.log("En cours")
        todo.statu ="En cours";
        this.doAction(todo);
      }
      else if(event.container.id == "cdk-drop-list-2") {
        console.log("En pause")
        todo.statu ="Pause";
        this.doAction(todo);
      }

      else if(event.container.id == "cdk-drop-list-3") {
        console.log("clôturé")
        todo.statu ="Cloture";
        this.doAction(todo);
      }
    }
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Add') {
        this.addTask(result.data);
      }
      if (result.event === 'Edit') {
        this.editTask(result.data);
      }
    });
  }

  addTask(row_obj: any): void {
    // this.todos.push({
    //   id: this.todos.length + 1,
    //   titre: row_obj.titre,
    //   details: row_obj.details,
    // });
    this.dialog.open(OkAppTaskComponent);
  }

  editTask(row_obj: any): void {
    // this.todos = this.todos.filter((value: todos) => {
    //   if (value.id === row_obj.id) {
    //     value.title = row_obj.title;
    //     value.description = row_obj.description;
    //   }
    //   return true;
    // });

    // this.inprogress = this.inprogress.filter((value: todos) => {
    //   if (value.id === row_obj.id) {
    //     value.title = row_obj.title;
    //     value.description = row_obj.description;
    //   }
    //   return true;
    // });
    // this.onhold = this.onhold.filter((value: todos) => {
    //   if (value.id === row_obj.id) {
    //     value.title = row_obj.title;
    //     value.description = row_obj.description;
    //   }
    //   return true;
    // });

    // this.completed = this.completed.filter((value: todos) => {
    //   if (value.id === row_obj.id) {
    //     value.title = row_obj.title;
    //     value.description = row_obj.description;
    //   }
    //   return true;
    // });
  }

  deleteTask(t: Todos) {
    const del = this.dialog.open(DeleteAppTaskComponent);

    del.afterClosed().subscribe((result) => {
      if (result === 'true') {
        this.todos = this.todos.filter((task) => task.id !== t.id);
        this.inprogress = this.inprogress.filter((task) => task.id !== t.id);
        this.onhold = this.onhold.filter((task) => task.id !== t.id);
        this.completed = this.completed.filter((task) => task.id !== t.id);
      }
    });
  }


  doAction(toDo:Todos): void {
    this.http.post<Todos>(MesConstants.LOCALAHOST + "/actions/add" ,toDo,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {
            console.log(x)
          },
          error: (err) => {
            console.log(err);

            this._snackBar.open("Echec mise a jour", "502", {
              duration: 2000
            })
          }
        })

  }

}
