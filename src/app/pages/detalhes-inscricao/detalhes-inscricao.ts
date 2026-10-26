import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import {
  InscricaoService,
  type Inscricao
} from '../../dominio/inscricao.service';

import {
  avaliarInscricao,
  DATA_PROVA,
  type Categoria
} from '../../dominio/inscricao.regras';

@Component({
  selector: 'app-detalhes-inscricao',
  imports: [RouterLink],
  templateUrl: './detalhes-inscricao.html',
  styleUrl: './detalhes-inscricao.css'
})
export class DetalhesInscricao {
  inscricao: Inscricao | undefined;
  idade: number | null = null;
  categoria = '';
  mensagemErro = '';

  constructor(
    private route: ActivatedRoute,
    private inscricaoService: InscricaoService
  ) {
    this.carregarInscricao();
  }

  private carregarInscricao(): void {
    try {
      const email = this.route.snapshot.paramMap.get('email');

      if (!email) {
        this.mensagemErro = 'O e-mail da inscrição não foi informado.';
        return;
      }

      this.inscricao = this.inscricaoService.buscarPorEmail(email);

      if (!this.inscricao) {
        this.mensagemErro = 'Inscrição não encontrada.';
        return;
      }

      const avaliacao = avaliarInscricao(
        this.inscricao.nascimento,
        this.inscricao.distancia,
        DATA_PROVA
      );

      this.idade = avaliacao.idade;
      this.categoria = this.nomeCategoria(avaliacao.categoria);
    } catch {
      this.mensagemErro =
        'Não foi possível carregar os dados da inscrição.';
    }
  }

  private nomeCategoria(categoria: Categoria | null): string {
    const nomes: Record<Categoria, string> = {
      JUVENIL: 'Juvenil',
      ADULTO: 'Adulto',
      MASTER: 'Master',
      SENIOR: 'Sênior'
    };

    return categoria ? nomes[categoria] : 'Não definida';
  }
}
