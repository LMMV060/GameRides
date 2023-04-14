import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarPeticionComponent } from './visualizar-peticion.component';

describe('VisualizarPeticionComponent', () => {
  let component: VisualizarPeticionComponent;
  let fixture: ComponentFixture<VisualizarPeticionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizarPeticionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarPeticionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
