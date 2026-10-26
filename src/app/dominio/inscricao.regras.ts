
export type Distancia = 'KM_5' | 'KM_10';

export type Categoria =
  | 'JUVENIL'
  | 'ADULTO'
  | 'MASTER'
  | 'SENIOR';

export type ErroRegulamento =
  | 'IDADE_MINIMA'
  | 'DISTANCIA_NAO_PERMITIDA';

export const DATA_PROVA = '2027-03-14';

export interface AvaliacaoInscricao {
  idade: number;
  categoria: Categoria | null;
  erro: ErroRegulamento | null;
}

// Padroniza o e-mail para evitar diferenças entre maiúsculas, minúsculas e espaços nas extremidades
export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Converte uma data no formato AAAA-MM-DD em uma data local, retorna null se a data não existir ou estiver em formato inválido
function converterData(data: string): Date | null {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data);

  if (!partes) {
    return null;
  }

  const ano = Number(partes[1]);
  const mes = Number(partes[2]);
  const dia = Number(partes[3]);

  const dataConvertida = new Date(ano, mes - 1, dia);

  // O JavaScript pode ajustar datas inexistentes automaticamente. Por isso, verifica se dia, mês e ano continuam iguais.
  if (
    dataConvertida.getFullYear() !== ano ||
    dataConvertida.getMonth() !== mes - 1 ||
    dataConvertida.getDate() !== dia
  ) {
    return null;
  }

  return dataConvertida;
}

// Calcula a idade completa na data de referência
export function calcularIdade(
  nascimento: string,
  referencia: string
): number {
  const dataNascimento = converterData(nascimento);
  const dataReferencia = converterData(referencia);

  if (!dataNascimento || !dataReferencia) {
    throw new RangeError(
      'A data de nascimento ou a data de referência é inválida.'
    );
  }

  let idade = dataReferencia.getFullYear() - dataNascimento.getFullYear();

  const aniversarioAindaNaoChegou =
    dataReferencia.getMonth() < dataNascimento.getMonth() || (dataReferencia.getMonth() === dataNascimento.getMonth() && dataReferencia.getDate() < dataNascimento.getDate());

  if (aniversarioAindaNaoChegou) {
    idade--;
  }

  return idade;
}

// Avalia a inscrição de acordo com o regulamento da corrida
export function avaliarInscricao(nascimento: string, distancia: Distancia, dataProva: string): AvaliacaoInscricao {
  const idade = calcularIdade(nascimento, dataProva);

  let categoria: Categoria | null = null;

  if (idade >= 14 && idade <= 17) {
    categoria = 'JUVENIL';
  } else if (idade >= 18 && idade <= 39) {
    categoria = 'ADULTO';
  } else if (idade >= 40 && idade <= 59) {
    categoria = 'MASTER';
  } else if (idade >= 60) {
    categoria = 'SENIOR';
  }

  // Primeiro verifica-se a idade mínima
  if (idade < 14) {
    return {
      idade,
      categoria: null,
      erro: 'IDADE_MINIMA'
    };
  }

  // Depois verifica-se a restrição específica dos 10 km
  if (distancia === 'KM_10' && idade < 18) {
    return {
      idade,
      categoria,
      erro: 'DISTANCIA_NAO_PERMITIDA'
    };
  }

  return {
    idade,
    categoria,
    erro: null
  };
}
