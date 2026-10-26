import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulario-inscricao',
  imports: [FormsModule, RouterLink],
  templateUrl: './formulario-inscricao.html',
  styleUrl: './formulario-inscricao.css',
})
export class FormularioInscricao {

  nome = '';
  email = '';
  nascimento = '';
  distancia: 'KM_5' | 'KM_10' = 'KM_5';

  mensagemErro = '';

  enviarFormulario(): void {

    this.mensagemErro = '';

    const nomeNormalizado = this.nome.trim().replace(/\s+/g, ' ');
    const emailNormalizado = this.email.trim().toLowerCase();

    if (nomeNormalizado.length < 3 || nomeNormalizado.length > 100) {
      this.mensagemErro = 'O nome deve ter entre 3 e 100 caracteres.';
      return;
    }

    if (!emailNormalizado || !emailNormalizado.includes('@')) {
      this.mensagemErro = 'Informe um e-mail válido.';
      return;
    }

    if (!this.nascimento) {
      this.mensagemErro = 'Informe sua data de nascimento.';
      return;
    }

    const dataNascimento = new Date(`${this.nascimento}T00:00:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(dataNascimento.getTime()) ||
      dataNascimento >= hoje
    ) {
      this.mensagemErro = 'A data de nascimento deve ser anterior a hoje.';
      return;
    }

    this.nome = nomeNormalizado;
    this.email = emailNormalizado;

    alert('Dados validados! Na próxima etapa, vamos salvar a inscrição.');

  };

};



