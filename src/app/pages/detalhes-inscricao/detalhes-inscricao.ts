import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';

import { InscricaoService, type Inscricao } from '../../dominio/inscricao.service';

import { avaliarInscricao, DATA_PROVA, type Categoria, type Distancia } from '../../dominio/inscricao.regras';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detalhes-inscricao',
  imports: [RouterLink, FormsModule],
  templateUrl: './detalhes-inscricao.html',
  styleUrl: './detalhes-inscricao.css'
})

export class DetalhesInscricao {
  inscricao: Inscricao | undefined;
  idade: number | null = null;
  categoria = '';
  mensagemErro = '';

  editando = false;
  nomeEditado = '';
  emailEditado = '';
  nascimentoEditado = '';
  distanciaEditada: Distancia =  'KM_5';
  mensagemEdicao = '';

  
  abrirEdicao(): void { 
    
    if (!this.inscricao) return;

    this.nomeEditado = this.inscricao.nome;
    this.emailEditado = this.inscricao.email;
    this.nascimentoEditado = this.inscricao.nascimento;
    this.distanciaEditada = this.inscricao.distancia;

    this.mensagemEdicao = '';
    this.editando = true;
  }

  fecharEdicao(): void {
    this.editando = false;
    this.mensagemEdicao = '';
  }

  salvarEdicao(): void {
    if (!this.inscricao) return;

    this.mensagemEdicao = '';

    try {
      this.inscricaoService.atualizar(this.inscricao.email, {
        nome: this.nomeEditado,
        nascimento: this.nascimentoEditado,
        distancia: this.distanciaEditada
      });

      this.inscricao = this.inscricaoService.buscarPorEmail(
        this.inscricao.email
      );

      if (this.inscricao) {
        const avaliacao = avaliarInscricao(
          this.inscricao.nascimento,
          this.inscricao.distancia,
          DATA_PROVA
        );

        this.idade = avaliacao.idade;
        this.categoria = this.nomeCategoria(avaliacao.categoria);
      }

      this.editando = false;
    } catch (erro: unknown) {
      this.mensagemEdicao =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível salvar as alterações.';
    }

    
  }

  cancelarInscricao(): void {
    if (!this.inscricao) return;

    const confirmou = window.confirm(
      `Deseja realmente cancelar a inscrição de ${this.inscricao.nome}?`
    );

    if (!confirmou) return;

    try {
      this.inscricaoService.cancelar(this.inscricao.email);

      void this.router.navigate(['/inscricoes']);
    } catch (erro: unknown) {
      this.mensagemErro =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível cancelar a inscrição.';
    }
  }



  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
