
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  InscricaoService
} from '../../dominio/inscricao.service';

import type {
  Distancia
} from '../../dominio/inscricao.regras';

@Component({
  selector: 'app-formulario-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './formulario-inscricao.html',
  styleUrl: './formulario-inscricao.css'
})

export class FormularioInscricao {
  nome = '';
  email = '';
  nascimento = '';
  distancia: Distancia = 'KM_5';

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private inscricaoService: InscricaoService
  ) {}

  enviarFormulario(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    try {

      this.inscricaoService.cadastrar({
        nome: this.nome,
        email: this.email,
        nascimento: this.nascimento,
        distancia: this.distancia

      });

      this.mensagemSucesso = 'Inscrição realizada com sucesso! Seus dados foram salvos.';

      // Limpa os campos depois do cadastro
      this.nome = '';
      this.email = '';
      this.nascimento = '';
      this.distancia = 'KM_5';

    } catch (erro: unknown) {
      this.mensagemErro = erro instanceof Error ? erro.message : 'Não foi possível realizar a inscrição.';
    };

  };

};
