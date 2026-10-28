
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

      const mensagem = erro instanceof Error ? erro.message : '';

      const errosConhecidos = [

        'O nome deve ter entre 3 e 100 caracteres.',
        'Informe um e-mail válido.',
        'A data de nascimento deve ser válida e anterior a hoje.',
        'É necessário ter pelo menos 14 anos no dia da prova.',
        'A distância de 10 km é permitida apenas para maiores de 17 anos.',
        'Já existe uma inscrição ativa com esse e-mail.',
        'Os dados salvos das inscrições estão corrompidos.',
        'Os dados salvos das inscrições não possuem uma lista válida.',
        'Existem inscrições salvas com dados inválidos.',
        'Não foi possível acessar os dados salvos. Verifique o armazenamento do navegador.'

      ];

      this.mensagemErro = errosConhecidos.includes(mensagem) ? mensagem : 'Não foi possível salvar sua inscrição. Verifique o armazenamento do navegador e tente novamente.'

    };

  };

};
