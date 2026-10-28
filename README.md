# Passo Vivo — Inscrições da Corrida Solidária

## 1. Sobre o projeto

Aplicação frontend desenvolvida em Angular 21 para gerenciar as inscrições da Corrida Solidária. O sistema permite cadastrar, listar, consultar, editar e cancelar inscrições, além de acompanhar o total de participantes por percurso. Os dados são persistidos no navegador por meio do `localStorage`, sem necessidade de um backend.

## 2. Tecnologias utilizadas

- Angular 21
- TypeScript
- HTML e CSS
- Angular Router
- FormsModule
- `localStorage` e `sessionStorage`

## 3. Como executar o projeto

### Pré-requisitos

- Node.js compatível com o Angular 21.
- npm.

### Instalação

Na pasta raiz do projeto, execute:

```bash
npm install
```

### Executar em desenvolvimento

```bash
npx ng serve
```

Depois, acesse o endereço indicado no terminal, normalmente:

`http://localhost:4200`

### Compilar o projeto

```bash
npx ng build
```

O comando de compilação deve ser executado antes da entrega para verificar se a aplicação pode ser construída sem erros.

## 4. Entendimento do problema

A organização precisa gerenciar as inscrições da Corrida Solidária, permitindo consultar e manter os dados dos participantes. Cada inscrição contém nome, e-mail, data de nascimento e percurso escolhido. A idade na data da prova e a categoria são calculadas pelo sistema. O total de participantes e a quantidade por percurso devem permanecer coerentes com as inscrições ativas.

## 5. Regras de negócio e fontes

As regras foram implementadas com base no enunciado técnico e no regulamento disponibilizado no pacote do cliente.

### Inscrição

- O nome é obrigatório e deve ter entre 3 e 100 caracteres após a remoção dos espaços nas extremidades e a redução de espaços internos repetidos.
- O e-mail é obrigatório, deve ter formato válido, é normalizado removendo espaços nas extremidades e convertendo letras para minúsculas, e não pode estar associado a outra inscrição ativa.
- A data de nascimento deve ser válida e anterior à data atual.
- O percurso deve ser de 5 km ou 10 km.
- Uma inscrição bem-sucedida é adicionada à lista e os campos do formulário são limpos.

### Idade e categorias

A idade considerada é a idade completa do participante na data da prova, marcada para **14 de março de 2027**.

- Idade mínima: 14 anos na data da prova.
- Percurso de 10 km: permitido apenas a participantes com 18 anos ou mais.
- Juvenil: 14 a 17 anos.
- Adulto: 18 a 39 anos.
- Master: 40 a 59 anos.
- Sênior: 60 anos ou mais.

A idade e a categoria são calculadas pelo sistema, não preenchidas manualmente pelo usuário.

### Edição

- É permitido alterar nome, data de nascimento e percurso.
- O e-mail funciona como identificador da inscrição e não pode ser alterado durante a edição.
- Os dados são validados novamente ao salvar.
- Uma edição inválida deve preservar os dados anteriores.
- A alteração do percurso deve refletir nos totais correspondentes.

### Cancelamento e consulta

- O cancelamento remove a inscrição ativa e atualiza os totais.
- O e-mail de uma inscrição cancelada pode ser utilizado em um novo cadastro.
- A consulta de uma inscrição inexistente deve apresentar uma mensagem apropriada, sem deixar a aplicação em branco.

### Persistência e resumo

- As inscrições são armazenadas no `localStorage`, usando a chave `corrida.inscricoes.v1`.
- A aplicação começa com a lista vazia quando não existem dados salvos.
- O total geral e as quantidades por percurso devem corresponder à lista, inclusive quando não houver inscrições.
- Dados corrompidos e falhas de armazenamento devem ser tratados com avisos, mantendo a aplicação utilizável.

### Fontes

1. **Projeto de Aptidão FRONT-END 1 — Inscrições da Corrida Solidária**, especialmente as seções de dados e comportamento, implementação Angular e rotas obrigatórias.
2. **Pacote do cliente — Corrida Solidária**, especialmente o regulamento oficial, as mensagens da organização e a atualização do pedido de edição e consulta individual.

## 6. Conflitos identificados e decisões

### Idade por ano de nascimento ou idade completa

Uma mensagem informal da organização sugere calcular a categoria apenas pelo ano de nascimento. Entretanto, o regulamento oficial determina a idade completa na data da prova.

**Decisão:** utilizar a idade completa na data da prova, seguindo o regulamento oficial.

### E-mails com letras maiúsculas e espaços

O pacote do cliente apresenta dúvidas sobre e-mails digitados com diferenças de formatação e sobre aliases de provedores de e-mail.

**Decisão:** remover espaços nas extremidades e converter o e-mail para minúsculas antes de verificar duplicidade. Não foi implementada uma regra para identificar aliases como se fossem o mesmo endereço, pois isso não faz parte da normalização geral solicitada.

### Identificação da inscrição

O e-mail é utilizado como identificador para consulta, edição e cancelamento.

**Decisão:** preservar o e-mail durante a edição. Para utilizar outro endereço, o usuário deve cancelar a inscrição anterior e realizar um novo cadastro.

### Rotas e apresentação da edição

A implementação atual utiliza a rota `/inscricoes/nova-inscricao` para o cadastro e apresenta a edição por meio de uma interface modal. O enunciado descreve uma rota `/inscricoes/nova` e uma rota específica para edição.

**Situação:** diferença conhecida em relação às rotas descritas no enunciado, mantida nesta versão. Deve ser considerada uma pendência de conformidade caso seja exigida correspondência exata com todas as rotas especificadas.

## 7. Perguntas ao cliente

Os seguintes pontos poderiam ser esclarecidos em uma validação com a organização:

1. Deve ser permitida a inscrição de mais de uma pessoa utilizando o mesmo e-mail? A implementação atual exige um e-mail único por inscrição ativa.
2. A organização pretende estabelecer um prazo para encerrar inscrições e cancelamentos? Esse bloqueio não foi implementado, pois está fora do escopo informado.
3. Existe alguma regra adicional para tratar aliases de e-mail ou endereços que pertençam à mesma pessoa? A implementação considera a normalização por espaços e letras minúsculas.

## 8. Fora do escopo

Conforme o pacote do cliente, não foram implementados:

- Pagamento de inscrições.
- Envio de e-mails ou notificações externas.
- Login e autenticação de usuários.
- Autorização de responsáveis legais.
- Bloqueio automático de inscrições ou cancelamentos por prazo.
- Integração com backend ou banco de dados remoto.

## 9. Verificações realizadas

Os testes manuais realizados durante o desenvolvimento incluíram:

- Cadastro com dados válidos e apresentação de mensagem de sucesso.
- Limpeza dos campos e retorno à lista após o cadastro.
- Persistência dos dados após atualizar a página.
- Validação da idade mínima e das restrições do percurso de 10 km.
- Verificação das categorias por faixa etária.
- Bloqueio de e-mails duplicados, inclusive com diferenças de maiúsculas e minúsculas.
- Edição válida e preservação dos dados anteriores quando uma edição é recusada.
- Cancelamento, atualização dos totais e reutilização do e-mail após o cancelamento.
- Tratamento de dados corrompidos no `localStorage`.
- Tratamento de falha simulada ao salvar os dados.
- Consulta de inscrições existentes e tratamento de inscrições inexistentes.
- Exibição da página 404 para caminhos desconhecidos.
- Navegação entre telas e utilização dos botões de voltar e avançar do navegador.
- Exibição e remoção da mensagem de sucesso após o cadastro.

## 10. Observações finais

O projeto foi desenvolvido com foco no funcionamento do CRUD, na validação das regras de negócio, na persistência local e no tratamento de erros. As decisões e diferenças conhecidas em relação ao enunciado foram registradas para facilitar a revisão e a evolução futura da aplicação.