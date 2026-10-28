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

@Injectable({ providedIn: 'root' })

export class InscricaoService {

  
  listar(): Inscricao[] {
    let dados: string | null;

    try {
      dados = localStorage.getItem(CHAVE_STORAGE);
    } catch {
      throw new Error(
        'Não foi possível acessar os dados salvos. Verifique o armazenamento do navegador.'
      );
    }

    if (!dados) {
      return [];
    }

    let dadosConvertidos: unknown;

    try {
      dadosConvertidos = JSON.parse(dados);
    } catch {
      throw new Error(
        'Os dados salvos das inscrições estão corrompidos.'
      );
    }

    if (!Array.isArray(dadosConvertidos)) {
      throw new Error(
        'Os dados salvos das inscrições não possuem uma lista válida.'
      );
    }

    const estruturaValida = dadosConvertidos.every(
      (item: unknown) => {
        if (
          item === null ||
          typeof item !== 'object' ||
          Array.isArray(item)
        ) {
          return false;
        }

        const inscricao = item as Partial<Inscricao>;

        return (
          typeof inscricao.nome === 'string' &&
          inscricao.nome.trim().length > 0 &&
          typeof inscricao.email === 'string' &&
          inscricao.email.trim().length > 0 &&
          typeof inscricao.nascimento === 'string' &&
          /^\d{4}-\d{2}-\d{2}$/.test(inscricao.nascimento) &&
          (
            inscricao.distancia === 'KM_5' ||
            inscricao.distancia === 'KM_10'
          )
        );
      }
    );

    if (!estruturaValida) {
      throw new Error(
        'Existem inscrições salvas com dados inválidos.'
      );
    }

    return dadosConvertidos as Inscricao[];
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

  
atualizar(emailOriginal: string, alteracoes: Pick<Inscricao, 'nome' | 'nascimento' | 'distancia'>): void {
  const inscricoes = this.listar();

  const indice = inscricoes.findIndex(
    inscricao =>
      normalizarEmail(inscricao.email) === normalizarEmail(emailOriginal)
  );

  if (indice === -1) {
    throw new Error('Inscrição não encontrada.');
  }

  const nome = alteracoes.nome.trim().replace(/\s+/g, ' ');

  if (nome.length < 3 || nome.length > 100) {
    throw new Error('O nome deve ter entre 3 e 100 caracteres.');
  }

  const nascimento = alteracoes.nascimento;
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nascimento);

  if (!partes) {
    throw new Error('Informe uma data de nascimento válida.');
  }

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);
  const dataNascimento = new Date(ano, mes - 1, dia);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  if (
    dataNascimento.getFullYear() !== ano ||
    dataNascimento.getMonth() !== mes - 1 ||
    dataNascimento.getDate() !== dia ||
    dataNascimento >= hoje
  ) {
    throw new Error(
      'A data de nascimento deve ser válida e anterior a hoje.'
    );
  }

  if (alteracoes.distancia !== 'KM_5' &&
      alteracoes.distancia !== 'KM_10') {
    throw new Error('Selecione uma distância válida.');
  }

  const avaliacao = avaliarInscricao(
    nascimento,
    alteracoes.distancia,
    DATA_PROVA
  );

  if (avaliacao.erro === 'IDADE_MINIMA') {
    throw new Error(
      'É necessário ter pelo menos 14 anos no dia da prova.'
    );
  }

  if (avaliacao.erro === 'DISTANCIA_NAO_PERMITIDA') {
    throw new Error(
      'A distância de 10 km é permitida apenas para maiores de 17 anos.'
    );
  }

  inscricoes[indice] = {
    ...inscricoes[indice],
    nome,
    nascimento,
    distancia: alteracoes.distancia
  };

  localStorage.setItem(
    CHAVE_STORAGE,
    JSON.stringify(inscricoes)
  );

}

cancelar(email: string): void {

  const inscricoes = this.listar();
  const emailNormalizado = normalizarEmail(email);

  const indice = inscricoes.findIndex(inscricao => normalizarEmail(inscricao.email) === emailNormalizado);

  if (indice === -1) {
    throw new Error('Inscrição não encontrada.');
  }

  inscricoes.splice(indice, 1);

  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(inscricoes));

}

}
