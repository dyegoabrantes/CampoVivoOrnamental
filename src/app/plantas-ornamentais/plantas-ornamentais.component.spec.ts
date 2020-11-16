import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantasOrnamentaisComponent } from './plantas-ornamentais.component';

describe('PlantasOrnamentaisComponent', () => {
  let component: PlantasOrnamentaisComponent;
  let fixture: ComponentFixture<PlantasOrnamentaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantasOrnamentaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantasOrnamentaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
