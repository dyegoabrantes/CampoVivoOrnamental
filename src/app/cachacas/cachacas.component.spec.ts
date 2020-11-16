import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CachacasComponent } from './cachacas.component';

describe('CachacasComponent', () => {
  let component: CachacasComponent;
  let fixture: ComponentFixture<CachacasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CachacasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CachacasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
