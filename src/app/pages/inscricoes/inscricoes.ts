import { Component } from '@angular/core';
import { email } from '@angular/forms/signals';

interface Participante {
  nome: string;
  email: string;
  idade: number;
  distancia: 'KM_5' | 'KM_10';
  categoria: 'Juvenil' | 'Adulto' | 'Master' | 'Sênior';
}

@Component({
  selector: 'app-inscricoes',
  imports: [],
  templateUrl: './inscricoes.html',
  styleUrl: './inscricoes.css',
})
export class Inscricoes {
  participantes: Participante[] = [

    {
      nome: 'Bruno Furtado',
      email: 'bruno.furtado@email.com',
      idade: 23,
      distancia: 'KM_10',
      categoria: 'Adulto',
    },

    {
      nome: 'Fernando Melo',
      email: 'fernando.melo@email.com',
      idade: 27,
      distancia: 'KM_10',
      categoria: 'Adulto'
    },

    {
      nome: 'Sarah Mendes',
      email: 'sarah.mendas@email.com',
      idade: 43,
      distancia: 'KM_5',
      categoria: 'Master'
    },

    {
      nome: 'Karen Rosa',
      email: 'karen.rosa@email.com',
      idade: 71,
      distancia: 'KM_10',
      categoria: 'Sênior'
    },

    {
      nome: 'João Guilherme',
      email: 'joao.guilherme@email.com',
      idade: 15,
      distancia: 'KM_5',
      categoria: 'Juvenil'
    }
  ];

  get totalInscritos(): number {
    return this.participantes.length;
  }

  get totalKm5(): number {
    return this.participantes.filter(
      participante => participante.distancia === 'KM_5'
    ).length;
  }

  get totalKm10(): number {
    return this.participantes.filter(
      participante => participante.distancia === 'KM_10'
    ).length;
  }
}
