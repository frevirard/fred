import { Component, OnInit } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from 'src/app/services/tokenStorage.service';
import { MesConstants } from 'src/app/services/MesConstants';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class AppNotesComponent implements OnInit {

  sidePanelOpened = true;
  notes = this.noteService.getNotes();
  username = ""
  selectedNote: Note = Object.create(null);
  active: boolean = false;
  searchText = '';
  clrName = 'primary';
  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'accent' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];
  loading: boolean;
  private nameSubject = new Subject<string>();
  constructor(public jwtService:TokenStorageService,  public noteService: NoteService,public dialog: MatDialog,private _snackBar: MatSnackBar,private http: HttpClient,private jwt:TokenStorageService)
  {
    this.nameSubject.pipe(debounceTime(1000)).subscribe(value => {
     // Update the final name only after debounce
      this.saveSelectedNote()

    });
     this.notes = this.noteService.getNotes();

  }

  onNameChange(value: string) {
   this.nameSubject.next(value)
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.notes = this.filter(filterValue);
  }

  filter(v: string): Note[] {
    return this.noteService
      .getNotes()
      .filter((x) => x.title.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  ngOnInit(): void {
    this.onLoad();
    this.loading = true
    this.jwt.logInCheck();
    this.username = this.jwtService.getUser().userName;
    console.log(this.jwtService.getUser());
    this.username
    this.http.get<Note[]>(MesConstants.LOCALAHOST +"/note/getAll/" + this.username, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.jwt.getToken()
      })
    }).subscribe({
      next: (x) => {
        console.log("notes", x)
        this.notes= x.sort((a, b) => {
          if (a.datef < b.datef) {
            return -1;
          }
          if (a.datef > b.datef) {
            return 1;
          }
          return 0;
        });
        this.loading = false;
      },

      error: (err) => {
        this.loading = false;
        this._snackBar.open("Echec Récupération liste des notes", "502", {
          duration: 2000
        })
      }
    })
  }
  onLoad(): void {
    this.selectedNote = this.notes[0];
  }
  onSelect(note: Note): void {
    this.selectedNote = note;
    this.clrName = this.selectedNote.color;
  }
  onSelectColor(colorName: string): void {
    this.clrName = colorName;
    this.selectedNote.color = this.clrName;
    this.saveSelectedNote()
    // this.clrName.active = !this.clrName.active;
    this.active = !this.active;

  }

  removenote(note: Note): void {



    this.http.delete(MesConstants.LOCALAHOST + "/note/delete/" + note.id ,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {
            const index: number = this.notes.indexOf(note);
             if (index !== -1) {
             this.notes.splice(index, 1);
             this.selectedNote = this.notes[0];
              }
          },
          error: (err) => {
            console.log(err);

            this._snackBar.open("Echec Suppression", "502", {
              duration: 2000
            })
          }
        })
  }

  addNoteClick(): void {
    let note = {
      id:null,
      color: this.clrName,
      title: 'Nouvelle Note',
      datef: new Date(),
      auteur: this.username
    }


    this.http.post<Note>(MesConstants.LOCALAHOST + "/note/add" ,note,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => { this.notes.unshift(x);
            console.log(x);
          },
          error: (err) => {
            console.log(err);

            this._snackBar.open("Echec ajout Note", "502", {
              duration: 2000
            })
          }
        })

  }

  saveSelectedNote() {
    this.http.post<Note>(MesConstants.LOCALAHOST + "/note/add" ,this.selectedNote,{headers:new HttpHeaders({ 'Content-Type': 'application/json' ,
      'Authorization': "Bearer " + this.jwt.getToken()})}).subscribe({
          next: (x) => {
            //this.notes.unshift(x);
            console.log(x);
          },
          error: (err) => {
            console.log(err);

            this._snackBar.open("Echec ajout Note", "502", {
              duration: 2000
            })
          }
        })
  }
}

