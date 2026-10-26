import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesInscricao } from './detalhes-inscricao';

describe('DetalhesInscricao', () => {
  let component: DetalhesInscricao;
  let fixture: ComponentFixture<DetalhesInscricao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesInscricao],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesInscricao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
