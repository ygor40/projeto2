# Portfólio Angular + API PHP

Projeto desenvolvido com **Angular** no frontend e **PHP + MariaDB** no backend.

O sistema apresenta um portfólio pessoal com páginas de apresentação, projetos, catálogo de tecnologias, contato e uma área de gestão.

Os dados são obtidos através de uma API PHP conectada ao banco de dados MariaDB.

---

## Funcionalidades

O projeto possui:

- Página inicial;
- Página Sobre;
- Página de Projetos;
- Catálogo de tecnologias;
- Busca de tecnologias;
- Página de Contato;
- Formulário de contato integrado à API;
- Área de Gestão em `/gestao`;
- Cadastro de projetos;
- Edição de projetos;
- Exclusão de projetos;
- Validação dos campos Nome e Ano;
- Atualização automática da lista sem precisar usar F5;
- Confirmação antes da exclusão;
- Tratamento de carregamento e erros;
- Integração entre Angular, PHP e MariaDB;
- Navegação utilizando Angular Router.

---

# Instalação

Entre na pasta do projeto Angular:

```bash
cd portfolio-angular
```

Atualize os pacotes:

```bash
sudo apt-get update
```

Instale as dependências necessárias:

```bash
sudo apt-get install -y mariadb-server php-cli php-mysql php-mbstring
```

Instale também as dependências do Angular:

```bash
npm install
```

---

# Banco de Dados

O banco utilizado pela aplicação é:

```text
dwii_db
```

Para iniciar o MariaDB:

```bash
sudo service mariadb start
```

Em uma instalação nova, o banco pode ser criado utilizando:

```bash
sudo mariadb < sql/setup.sql
```

O script cria as tabelas utilizadas pelo projeto, incluindo:

```text
projetos
tecnologias
contatos
```

Para conferir os projetos salvos:

```bash
sudo mariadb -e "SELECT id, nome, ano, status FROM dwii_db.projetos;"
```

---

# Executando a API

Entre na pasta:

```bash
cd portfolio-angular
```

Inicie o MariaDB:

```bash
sudo service mariadb start
```

Depois execute:

```bash
/usr/bin/php -S 0.0.0.0:8000
```

A API ficará disponível através da porta:

```text
8000
```

No GitHub Codespaces, a porta 8000 precisa estar acessível pelo navegador.

Caso seja necessário consumir a API pelo Angular, confira se a porta está com visibilidade **Public**.

---

# Executando o Angular

Abra outro terminal e entre na pasta:

```bash
cd portfolio-angular
```

Execute:

```bash
ng serve --host 0.0.0.0 --port 4200
```

A aplicação ficará disponível através da porta:

```text
4200
```

Os dois servidores devem permanecer funcionando ao mesmo tempo:

```text
Porta 8000 -> API PHP
Porta 4200 -> Angular
```

---

# URL da API no Codespaces

O endereço público do Codespace pode mudar quando um novo ambiente é criado.

Quando isso acontecer, é necessário atualizar a URL utilizada nos services.

O endereço dos projetos fica no arquivo:

```text
portfolio-angular/src/app/services/projeto.ts
```

A URL deve terminar em:

```text
/api/projetos.php
```

O endereço das tecnologias fica no arquivo:

```text
portfolio-angular/src/app/services/tecnologia.ts
```

O endereço do formulário de contato fica no arquivo:

```text
portfolio-angular/src/app/contato.service.ts
```

---

# Endpoints da API

## Projetos

Endpoint:

```text
/api/projetos.php
```

A API utiliza o método HTTP da requisição para decidir qual operação deve executar.

### GET

Lista os projetos publicados.

```http
GET /api/projetos.php
```

Também é possível consultar um projeto por ID:

```http
GET /api/projetos.php?id=1
```

### POST

Cria um novo projeto:

```http
POST /api/projetos.php
```

Exemplo de dados:

```json
{
  "nome": "Portfólio Angular",
  "descricao": "Portfólio desenvolvido com Angular e API PHP",
  "tecnologias": "Angular, PHP, MariaDB",
  "link_github": "",
  "ano": 2026
}
```

Quando o projeto é criado corretamente, a API responde:

```text
201 Created
```

### PUT

Atualiza um projeto existente:

```http
PUT /api/projetos.php?id=1
```

Quando a atualização funciona:

```text
200 OK
```

### DELETE

Remove um projeto:

```http
DELETE /api/projetos.php?id=1
```

Quando a exclusão funciona:

```text
204 No Content
```

---

## Tecnologias

Endpoint:

```text
/api/tecnologias.php
```

Retorna as tecnologias cadastradas no MariaDB em formato JSON.

---

## Contato

Endpoint:

```text
/api/contato.php
```

Recebe os dados enviados através da página de Contato e grava a mensagem no banco.

Quando o contato é cadastrado corretamente, a API responde com:

```text
201 Created
```

---

# Códigos de status utilizados

A API utiliza diferentes códigos HTTP dependendo do resultado da operação.

```text
200 -> requisição executada corretamente
201 -> um novo recurso foi criado
204 -> operação realizada sem conteúdo na resposta
400 -> dados obrigatórios ou ID ausentes
404 -> projeto não encontrado
405 -> método HTTP não permitido
500 -> erro interno do servidor
```

---

# Estrutura do Projeto

```text
projeto2/
│
├── README.md
│
└── portfolio-angular/
    │
    ├── api/
    │   ├── contato.php
    │   ├── projetos.php
    │   └── tecnologias.php
    │
    ├── sql/
    │   └── setup.sql
    │
    ├── src/
    │   └── app/
    │       │
    │       ├── catalogo/
    │       ├── contato/
    │       ├── gestao/
    │       ├── home/
    │       ├── projetos/
    │       ├── sobre/
    │       │
    │       ├── services/
    │       │   ├── projeto.ts
    │       │   └── tecnologia.ts
    │       │
    │       ├── app.html
    │       ├── app.routes.ts
    │       └── contato.service.ts
    │
    ├── conexao.php
    ├── angular.json
    └── package.json
```

---

# Tecnologias utilizadas

- Angular;
- TypeScript;
- HTML5;
- CSS3;
- Angular Router;
- Reactive Forms;
- HttpClient;
- PHP;
- PDO;
- MariaDB;
- Git;
- GitHub;
- GitHub Codespaces.

---

# Atividade 15 — Área de Gestão do Portfólio

Foi criada a rota:

```text
/gestao
```

Ela permite administrar os projetos diretamente pelo navegador, sem precisar cadastrar ou alterar registros utilizando SQL manualmente.

A tela possui um único formulário que pode ser utilizado tanto para adicionar quanto para editar um projeto.

A decisão é feita através da variável:

```text
editandoId
```

Quando ela está vazia, o formulário cria um projeto.

Quando possui o ID de um projeto, o formulário envia uma atualização.

---

## Operações disponíveis na Gestão

A tela permite:

```text
Listar   -> GET
Adicionar -> POST
Editar   -> PUT
Excluir  -> DELETE
```

As requisições HTTP não ficam dentro do componente de Gestão.

Quem conversa com a API é o:

```text
ProjetoService
```

localizado em:

```text
portfolio-angular/src/app/services/projeto.ts
```

O componente:

```text
portfolio-angular/src/app/gestao/gestao.ts
```

fica responsável pela lógica da tela.

---

# Um endereço, quatro ações

O mesmo endereço:

```text
api/projetos.php
```

consegue realizar quatro operações porque o servidor verifica o método HTTP utilizado na requisição.

Assim, apesar da URL ser a mesma, a intenção da requisição é diferente:

```text
GET    -> consultar
POST   -> criar
PUT    -> atualizar
DELETE -> excluir
```

Isso evita precisar criar um endereço diferente para cada ação e mantém a API organizada seguindo o padrão de verbos HTTP.

---

# Validação do formulário

O formulário da Gestão possui validação para os campos Nome e Ano.

O Nome:

- é obrigatório;
- precisa possuir pelo menos 3 caracteres.

O Ano:

- é obrigatório;
- precisa possuir valor entre 2000 e 2100.

Quando um campo está inválido, a aplicação impede o envio e mostra uma mensagem em texto abaixo do campo.

---

# Atualização automática sem F5

Depois de adicionar ou editar um projeto, o método `salvar()` executa novamente:

```text
carregar()
```

Isso faz uma nova consulta à API e atualiza a lista automaticamente.

Também é executado:

```text
cancelarEdicao()
```

Esse método:

```text
editandoId = null
```

e limpa os campos do formulário.

Dessa forma, depois de salvar, a tela volta automaticamente para:

```text
Adicionar projeto
```

sem precisar atualizar a página manualmente.

---

# Estratégia utilizada no DELETE

Na exclusão foi utilizada uma estratégia diferente.

Depois que a API confirma o DELETE, o projeto é retirado diretamente do array local utilizando:

```text
filter()
```

Com isso, a linha desaparece imediatamente da tela sem fazer uma nova requisição GET.

As duas estratégias possuem vantagens diferentes.

Chamar `carregar()` faz uma nova viagem até o servidor e garante que a lista esteja igual ao banco.

Usar `filter()` não faz uma nova viagem à rede e deixa a alteração visual mais rápida, porém depende de o estado local da aplicação estar atualizado.

---

# Confirmação antes da exclusão

Antes de excluir um projeto, a aplicação mostra uma confirmação contendo o nome do registro.

Exemplo:

```text
Excluir o projeto "Projeto de teste"?
Esta ação não pode ser desfeita.
```

A exclusão só é enviada para a API quando o usuário confirma a operação.

Isso evita apagar um projeto acidentalmente.

---

# Por que não usar GET para excluir?

Uma exclusão não deve utilizar um link comum com GET.

O método GET é destinado a consultar informações e não deveria alterar os dados do servidor.

Se uma URL GET apagasse registros, uma simples visita ao endereço, um pré-carregamento do navegador, um robô ou outro mecanismo automático poderia disparar a exclusão sem intenção do usuário.

Por isso a aplicação utiliza corretamente:

```text
DELETE
```

para remover projetos.

---

# Projeto cadastrado pela tela

Durante os testes da Atividade 15 foi cadastrado diretamente pela área de Gestão:

```text
Nome: Portfólio Angular
Tecnologias: Angular, PHP, MariaDB
Ano: 2026
```

O registro foi criado pela tela e apareceu automaticamente na lista sem necessidade de F5.

---

# Evidência da aba Network

Foi realizada uma operação de escrita através da tela `/gestao`.

Na aba Network do DevTools foi registrada a requisição:

```text
Request Method: POST
Status Code: 201 Created
Content-Type: application/json; charset=utf-8
Endpoint: api/projetos.php
```

O projeto criado também apareceu na lista da Gestão logo após a resposta da API.

---

# Diferença entre 201 e 204

O POST retorna:

```text
201 Created
```

porque a requisição criou um novo recurso no servidor.

O DELETE retorna:

```text
204 No Content
```

porque a exclusão foi realizada corretamente, mas não existe necessidade de enviar um conteúdo no corpo da resposta.

Por isso criar utiliza 201 e excluir utiliza 204.

---

# Testes realizados

Durante o desenvolvimento foram testadas as quatro operações principais:

```text
GET    -> carregamento da lista
POST   -> 201 Created
PUT    -> 200 OK
DELETE -> 204 No Content
```

Também foram conferidas respostas de erro da API:

```text
400 -> requisição inválida ou campo obrigatório ausente
404 -> projeto não encontrado
405 -> método HTTP não permitido
```

---

# Consulta no MariaDB

Depois dos testes foi realizada a consulta:

```bash
sudo mariadb -e "SELECT id, nome, ano, status FROM dwii_db.projetos;"
```

O comando permitiu verificar diretamente no banco quais projetos estavam cadastrados e seus respectivos anos e status.

Esse resultado também foi registrado em print para a entrega da atividade.

---

# Pré-voo e OPTIONS

Antes de determinadas requisições feitas pelo navegador, principalmente operações como PUT e DELETE, pode existir uma requisição OPTIONS.

Ela serve para o navegador verificar se o servidor permite que aquela origem utilize determinados métodos HTTP.

A API informa os métodos permitidos através do cabeçalho:

```text
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

O OPTIONS pode responder:

```text
204 No Content
```

permitindo que o navegador continue com a requisição real.

---

# Boas práticas utilizadas

As URLs da API e o `HttpClient` ficam centralizados nos services.

Por exemplo:

```text
portfolio-angular/src/app/services/projeto.ts
```

é responsável pelas requisições relacionadas aos projetos.

Já:

```text
portfolio-angular/src/app/gestao/gestao.ts
```

não possui URL da API e não utiliza `HttpClient` diretamente.

Dessa maneira, o componente cuida da interface e o service cuida da comunicação com a API.

---

# Estados da tela

A área de Gestão possui tratamento para diferentes estados.

Durante a consulta:

```text
Carregando projetos...
```

Quando ocorre um erro, uma mensagem é apresentada diretamente na tela.

Quando não existem projetos, a interface mostra:

```text
Nenhum projeto cadastrado ainda.
```

Isso evita deixar um espaço vazio sem explicar ao usuário o que aconteceu.

---

# Autoavaliação — Atividade 15

**Conceito pretendido: C**

## R1 — A API realiza as quatro operações

Arquivo:

```text
portfolio-angular/api/projetos.php
```

A API verifica o método HTTP da requisição e trata:

```text
GET
POST
PUT
DELETE
```

As operações de escrita no banco utilizam PDO com `prepare()` e `execute()`.

---

## R2 — Tela de Gestão

Arquivos principais:

```text
portfolio-angular/src/app/gestao/gestao.ts
portfolio-angular/src/app/gestao/gestao.html
portfolio-angular/src/app/gestao/gestao.css
```

A rota:

```text
/gestao
```

lista os projetos e permite criar, editar e excluir registros.

O formulário possui validação de Nome e Ano.

Antes de excluir, a tela pede confirmação mostrando o nome do projeto.

A comunicação com a API é realizada pelo:

```text
portfolio-angular/src/app/services/projeto.ts
```

Não existe URL da API nem `HttpClient` dentro de `gestao.ts`.

---

## R3 — A tela reflete a alteração sem recarregar

No método:

```text
salvar()
```

do arquivo:

```text
portfolio-angular/src/app/gestao/gestao.ts
```

depois de criar ou editar, a aplicação executa:

```text
cancelarEdicao()
carregar()
```

Assim, o formulário volta para o modo de adição e a lista é atualizada automaticamente.

Na exclusão, o método:

```text
filter()
```

retira o projeto do array local imediatamente.

Nenhuma dessas operações exige F5.

---

## R4 — Justificativa e evidências

Este README contém:

- explicação de como o mesmo endpoint executa quatro ações;
- justificativa da diferença entre os verbos HTTP;
- explicação da atualização automática da lista;
- comparação entre `carregar()` e `filter()`;
- explicação de por que DELETE não deve ser substituído por GET;
- registro de uma operação observada na aba Network;
- método HTTP;
- código de status;
- Content-Type;
- explicação da diferença entre 201 e 204;
- consulta realizada diretamente no MariaDB;
- autoavaliação da atividade.

---

# Evidências da entrega

Foram produzidas as seguintes evidências:

```text
1. Print da aba Network mostrando:
   POST
   201 Created
   Content-Type: application/json; charset=utf-8

2. Print do terminal executando:
   sudo mariadb -e "SELECT id, nome, ano, status FROM dwii_db.projetos;"

3. Tela /gestao funcionando com:
   Adicionar
   Editar
   Excluir
   Validação
   Atualização automática sem F5
```

---

# Git

Depois de finalizar a atividade, o projeto deve ser enviado a partir da raiz do repositório.

Primeiro volte para a raiz:

```bash
cd /workspaces/projeto2
```

Confira as alterações:

```bash
git status
```

Adicione os arquivos:

```bash
git add .
```

Crie o commit:

```bash
git commit -m "Atividade 15 - area de gestao do portfolio"
```

Envie para o GitHub:

```bash
git push origin main
```

Depois confira:

```bash
git status
```

O esperado é:

```text
nothing to commit, working tree clean
```

---

# Autor

**Ygor Gustavo Alves de Freitas**