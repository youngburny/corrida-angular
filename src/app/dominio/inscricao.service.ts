import { Injectable } from '@angular/core';

import {
  avaliarInscricao,
  normalizarEmail,
  DATA_PROVA,
  type Distancia
} from './inscricao.regras';

export interface Inscricao {
  nome: string;
  email: string;
  nascimento: string;
  distancia: Distancia;
}

const CHAVE_STORAGE = 'corrida.inscricoes.v1';

@Injectable({
  providedIn: 'root'
})
export class InscricaoService {

  listar(): Inscricao[] {
    const dados = localStorage.getItem(CHAVE_STORAGE);

    if (!dados) {
      return [];
    }

    const inscricoes: unknown = JSON.parse(dados);

    if (!Array.isArray(inscricoes)) {
      throw new Error('Os dados salvos das inscrições são inválidos.');
    }

    return inscricoes as Inscricao[];
  }

  cadastrar(novaInscricao: Inscricao): void {
    const nome = novaInscricao.nome.trim().replace(/\s+/g, ' ');
    const email = normalizarEmail(novaInscricao.email);

    if (nome.length < 3 || nome.length > 100) {
      throw new Error('O nome deve ter entre 3 e 100 caracteres.');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Informe um e-mail válido.');
    }

    const nascimento = novaInscricao.nascimento;

    // A data precisa ser válida e anterior ao dia de hoje
    const dataNascimento = new Date(`${nascimento}T00:00:00`);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(nascimento) ||
      Number.isNaN(dataNascimento.getTime()) ||
      dataNascimento.toISOString().slice(0, 10) !== nascimento ||
      dataNascimento >= hoje
    ) {
      throw new Error(
        'A data de nascimento deve ser válida e anterior a hoje.'
      );
    }

    // Verifica as regras oficiais de idade e distância
    const avaliacao = avaliarInscricao(
      nascimento,
      novaInscricao.distancia,
      DATA_PROVA
    );

    if (avaliacao.erro === 'IDADE_MINIMA') {
      throw new Error('É necessário ter pelo menos 14 anos no dia da prova.');
    }

    if (avaliacao.erro === 'DISTANCIA_NAO_PERMITIDA') {
      throw new Error('A distância de 10 km é permitida apenas para maiores de 17 anos.');
    }

    const inscricoesAtuais = this.listar();

    const emailJaExiste = inscricoesAtuais.some(
      inscricao => normalizarEmail(inscricao.email) === email
    );

    if (emailJaExiste) {
      throw new Error('Já existe uma inscrição ativa com esse e-mail.');
    }

    const inscricaoNormalizada: Inscricao = {
      nome,
      email,
      nascimento,
      distancia: novaInscricao.distancia
    };

    inscricoesAtuais.push(inscricaoNormalizada);

    // Só considera o cadastro concluído depois de salvar
    localStorage.setItem(
      CHAVE_STORAGE,
      JSON.stringify(inscricoesAtuais)
    );
  }

  buscarPorEmail(email: string): Inscricao | undefined {
    const emailNormalizado = normalizarEmail(email);

    return this.listar().find(
      inscricao => normalizarEmail(inscricao.email) === emailNormalizado
    );
  }
}
