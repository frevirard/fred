import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionBoardComponent } from './action-board.component';

describe('ActionBoardComponent', () => {
  let component: ActionBoardComponent;
  let fixture: ComponentFixture<ActionBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
