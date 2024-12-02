import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssocieComponent } from './associe.component';

describe('AssocieComponent', () => {
  let component: AssocieComponent;
  let fixture: ComponentFixture<AssocieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssocieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
