import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocaoBanerComponent } from './promocao-baner.component';

describe('PromocaoBanerComponent', () => {
  let component: PromocaoBanerComponent;
  let fixture: ComponentFixture<PromocaoBanerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromocaoBanerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromocaoBanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
