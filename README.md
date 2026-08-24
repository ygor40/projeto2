# Portfólio Angular + API PHP

Projeto desenvolvido com **Angular** no frontend e **PHP + MariaDB** no backend.

O sistema apresenta um portfólio com páginas de apresentação, projetos e catálogo de tecnologias. Os dados das telas de **Projetos** e **Catálogo** são obtidos através de uma API PHP conectada ao banco de dados MariaDB.

## Instalação

Atualize os pacotes e instale as dependências necessárias:

```bash
sudo apt-get update
sudo apt-get install -y mariadb-server php-cli php-mysql
```

Instale também as dependências do projeto Angular:

```bash
npm install
```

## Configuração do Banco de Dados

Inicie o MariaDB:

```bash
sudo service mariadb start
```

Execute o script responsável pela criação e configuração do banco:

```bash
sudo mariadb < sql/setup.sql
```

O banco utilizado pela aplicação é:

```text
dwii_db
```

## Executando a API

Na pasta `portfolio-angular`, execute:

```bash
/usr/bin/php -S 0.0.0.0:8000
```

A API ficará disponível através da porta `8000`.

## Executando o Angular

Abra outro terminal e execute:

```bash
ng serve --host 0.0.0.0
```

A aplicação Angular ficará disponível através da porta `4200`.

## Endpoints da API

### Projetos

```text
/api/projetos.php
```

Retorna os projetos cadastrados no banco de dados em formato JSON.

### Tecnologias

```text
/api/tecnologias.php
```

Retorna as tecnologias cadastradas no banco de dados em formato JSON.

## Funcionalidades

O projeto possui as seguintes funcionalidades:

- Página inicial do portfólio;
- Página Sobre;
- Página de Contato;
- Página de Projetos;
- Consumo da API de projetos;
- Catálogo de tecnologias;
- Consumo da API de tecnologias;
- Busca e filtro das tecnologias;
- Dados carregados diretamente do MariaDB;
- Tratamento de carregamento e erro;
- Links dos projetos para o GitHub;
- Navegação entre páginas utilizando Angular Router.

## Estrutura do Projeto

```text
portfolio-angular/
├── api/
│   ├── projetos.php
│   └── tecnologias.php
├── sql/
│   └── setup.sql
├── src/
│   └── app/
│       ├── catalogo/
│       ├── contato/
│       ├── home/
│       ├── projetos/
│       ├── services/
│       │   ├── projeto.ts
│       │   └── tecnologia.ts
│       └── sobre/
├── conexao.php
├── package.json
├── angular.json
└── README.md
```

## Tecnologias Utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Angular Router
- HttpClient
- PHP
- PDO
- MariaDB
- Git
- GitHub

## Autoavaliação

**Conceito pretendido: A**

### Justificativa

- **Consumo da API (Projetos):** o arquivo `src/app/services/projeto.ts` utiliza o `HttpClient` para realizar uma requisição GET para `api/projetos.php`. Os dados retornados pela API são utilizados na tela de Projetos.

- **Catálogo e enriquecimento:** o arquivo `src/app/services/tecnologia.ts` utiliza o `HttpClient` para consumir o endpoint `api/tecnologias.php`. A tela `src/app/catalogo/catalogo.ts` exibe os dados reais das tecnologias cadastradas no banco e possui uma busca para filtrar os resultados.

- **Botão GitHub:** os projetos possuem link para o GitHub, permitindo acessar o repositório correspondente através do card do projeto.

- **Boas práticas Angular:** as URLs e requisições HTTP ficam concentradas nos services. Os componentes ficam responsáveis pela lógica de apresentação e exibição dos dados.

- **Tratamento de estados:** as telas possuem tratamento para situações de carregamento, erro e ausência de dados.

- **Integração com banco de dados:** a API foi desenvolvida em PHP utilizando PDO para realizar a conexão com o MariaDB.

- **Dados reais:** as telas de Projetos e Catálogo utilizam informações retornadas pela API e armazenadas no banco de dados, em vez de dados fixos diretamente nos componentes.

## Autor

**Ygor Gustavo Alves de Freitas**