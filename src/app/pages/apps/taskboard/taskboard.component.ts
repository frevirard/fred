import { Component } from '@angular/core';
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

// tslint:disable-next-line - Disables all
interface todos {
  id: number;
  title: string;
  description: string;
  class?: string;
}

@Component({
  selector: 'app-taskboard',
  templateUrl: './taskboard.component.html',
  styleUrls: ['./taskboard.component.scss'],
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, DragDropModule],
})
export class AppTaskboardComponent {
  todos: todos[] = [
    {
      id: 1,
      title: 'SUN Zhe',
      description: 'MAJ support PRINCE 2 avec ajout de quizz si besoin',
    },
    {
      id: 2,
      title: 'Theodore VARENNES',
      description: 'Rédaction de procédures',
    },
    {
      id: 3,
      title: 'GOMEZ Andrew',
      description:
        'Methode CARE',
      class: 'task-status-info',
    },
  ];

  inprogress: todos[] = [
    {
      id: 201,
      title: 'Frédéric EKEWOU',
      description: 'Formation VISUAL BASIC EXCEL',
    }

  ];

  completed: todos[] = [
    {
      id: 301,
      title: 'KHALFAOUI Ayoub',
      description:
        'Réponse à appel d offre',
    }
  ];

  onhold: todos[] = [
    {
      id: 401,
      title: 'ABDOULKARIM Cheick',
      description: 'Formation ACTIFS en suspens car départ en mission',
    }
  ];

  constructor(public dialog: MatDialog) {}

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
    this.todos.push({
      id: this.todos.length + 1,
      title: row_obj.title,
      description: row_obj.description,
    });
    this.dialog.open(OkAppTaskComponent);
  }

  editTask(row_obj: any): void {
    this.todos = this.todos.filter((value: todos) => {
      if (value.id === row_obj.id) {
        value.title = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });

    this.inprogress = this.inprogress.filter((value: todos) => {
      if (value.id === row_obj.id) {
        value.title = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });
    this.onhold = this.onhold.filter((value: todos) => {
      if (value.id === row_obj.id) {
        value.title = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });

    this.completed = this.completed.filter((value: todos) => {
      if (value.id === row_obj.id) {
        value.title = row_obj.title;
        value.description = row_obj.description;
      }
      return true;
    });
  }

  deleteTask(t: todos) {
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
}
