import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  InscricaoService,
  type Inscricao
} from '../../dominio/inscricao.service';

import {
  avaliarInscricao,
  DATA_PROVA,
  type Categoria
} from '../../dominio/inscricao.regras';

interface Participante {
  nome: string;
  email: string;
  idade: number;
  distancia: 'KM_5' | 'KM_10';
  categoria: 'Juvenil' | 'Adulto' | 'Master' | 'Sênior';
}

@Component({
  selector: 'app-inscricoes',
  imports: [RouterLink],
  templateUrl: './inscricoes.html',
  styleUrl: './inscricoes.css'
})

export class Inscricoes {
  participantes: Participante[] = [];
  mensagemErro = '';

  constructor(
    private inscricaoService: InscricaoService
  ) {
    this.carregarParticipantes();
  }

  carregarParticipantes(): void {
    this.mensagemErro = '';

    try {

      const inscricoes: Inscricao[] = this.inscricaoService.listar();

      this.participantes = inscricoes.map(inscricao => {
        const avaliacao = avaliarInscricao(
          inscricao.nascimento,
          inscricao.distancia,
          DATA_PROVA
        );

        return {
          nome: inscricao.nome,
          email: inscricao.email,
          idade: avaliacao.idade,
          distancia: inscricao.distancia,
          categoria: this.nomeCategoria(avaliacao.categoria)
        };

      });
    
    } catch {
      this.participantes = [];
      this.mensagemErro =
        'Não foi possível carregar as inscrições salvas.';
    }
  }

  private nomeCategoria(
    categoria: Categoria | null): Participante['categoria'] {

      const nomes: Record<Categoria, Participante['categoria']> = {
        JUVENIL: 'Juvenil',
        ADULTO: 'Adulto',
        MASTER: 'Master',
        SENIOR: 'Sênior'
      };

    return categoria ? nomes[categoria] : 'Juvenil';
  }

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
