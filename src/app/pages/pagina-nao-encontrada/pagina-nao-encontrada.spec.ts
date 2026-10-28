import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNaoEncontrada } from './pagina-nao-encontrada';

describe('PaginaNaoEncontrada', () => {
  let component: PaginaNaoEncontrada;
  let fixture: ComponentFixture<PaginaNaoEncontrada>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaNaoEncontrada],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaNaoEncontrada);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
