import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInscricao } from './formulario-inscricao';

describe('FormularioInscricao', () => {
  let component: FormularioInscricao;
  let fixture: ComponentFixture<FormularioInscricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioInscricao],
    }).compileComponents();

    fixture = TestBed.createComponent(FormularioInscricao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
