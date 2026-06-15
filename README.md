# Portfólio Angular + API PHP

Projeto desenvolvido com Angular no frontend e PHP + MariaDB no backend para gerenciamento de projetos e tecnologias.

## Instalação

Atualize os pacotes e instale as dependências:

```bash
sudo apt-get update
sudo apt-get install -y mariadb-server php-cli php-mysql
```

## Configuração do Banco de Dados

Inicie o MariaDB:

```bash
sudo service mariadb start
```

Execute o script de criação do banco:

```bash
sudo mariadb < sql/setup.sql
```

## Executando a API

Inicie o servidor PHP:

```bash
php -S 0.0.0.0:8000
```

## Endpoints

### Projetos

```text
/api/projetos.php
```

Retorna os projetos cadastrados em formato JSON.

### Tecnologias

```text
/ api/tecnologias.php
```

Retorna as tecnologias cadastradas em formato JSON.

## Estrutura do Projeto

```text
portfolio-angular/
├── api/
│   ├── projetos.php
│   └── tecnologias.php
├── sql/
│   └── setup.sql
├── src/
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
- PHP
- MariaDB

## Autor

Ygor Gustavo Alves de Freitas