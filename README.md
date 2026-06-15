# Portfólio Angular + API PHP

## Instalação

```bash
sudo apt-get update
sudo apt-get install -y mariadb-server php-cli php-mysql
```

## Configuração do banco

Inicie o MariaDB:

```bash
sudo service mariadb start
```

Execute o script SQL:

```bash
sudo mariadb < sql/setup.sql
```

## Executar a API

```bash
/usb/bin/php -S 0.0.0.0:8000
```

## Endpoints

### Projetos

```text
/api/projetos.php
```

Retorna os projetos publicados em formato JSON.

### Tecnologias

```text
/api/tecnologias.php
```

Retorna o catálogo de tecnologias em formato JSON.

## Estrutura

```text
api/
├── projetos.php
├── tecnologias.php

sql/
└── setup.sql

conexao.php
```
