-- =========================================================
-- BANCO DE DADOS DO PORTFÓLIO
-- Angular + PHP + MariaDB
-- =========================================================

CREATE DATABASE IF NOT EXISTS dwii_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE dwii_db;


-- =========================================================
-- TABELA PROJETOS
-- =========================================================

CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    tecnologias VARCHAR(255) NOT NULL,
    link_github VARCHAR(255) NULL,
    ano INT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'publicado'
);


-- =========================================================
-- TABELA TECNOLOGIAS
-- =========================================================

CREATE TABLE IF NOT EXISTS tecnologias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    ano_criacao INT NOT NULL
);


-- =========================================================
-- TABELA CONTATOS
-- =========================================================

CREATE TABLE IF NOT EXISTS contatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- TABELA USUARIOS
-- =========================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- LIMPAR PROJETOS E TECNOLOGIAS
-- =========================================================

DELETE FROM projetos;
DELETE FROM tecnologias;


-- =========================================================
-- REINICIAR IDS
-- =========================================================

ALTER TABLE projetos AUTO_INCREMENT = 1;
ALTER TABLE tecnologias AUTO_INCREMENT = 1;


-- =========================================================
-- USUARIO ADMINISTRADOR
-- =========================================================
-- Login:
-- E-mail: admin@portfolio.com
-- Senha: admin123
--
-- A senha abaixo está protegida com password_hash().
-- =========================================================

INSERT INTO usuarios (nome, email, senha)
VALUES (
    'Administrador',
    'admin@portfolio.com',
    '$2y$12$wsgzITcBmltZFgYjtEP2LeGJPwXX.8Wyny4CcDve/b4cP9XsAln8u'
)
ON DUPLICATE KEY UPDATE
    nome = VALUES(nome),
    senha = VALUES(senha);


-- =========================================================
-- DADOS DOS PROJETOS
-- =========================================================

INSERT INTO projetos
(nome, descricao, tecnologias, link_github, ano, status)
VALUES

(
    'Portfolio Pessoal',
    'Site de portfolio responsivo com PHP, PDO e MariaDB, painel admin e login.',
    'PHP, MariaDB, CSS, Git',
    'https://github.com/usuario/portfolio',
    2026,
    'publicado'
),

(
    'Sistema de Biblioteca',
    'CRUD de acervo e emprestimos, com busca e relatorios.',
    'PHP, MariaDB, Bootstrap',
    'https://github.com/usuario/biblioteca',
    2025,
    'publicado'
),

(
    'App de Tarefas',
    'Lista de tarefas com categorias, prazos e filtro por status.',
    'JavaScript, HTML, CSS',
    'https://github.com/usuario/tarefas',
    2025,
    'publicado'
),

(
    'Loja Virtual (prototipo)',
    'Catalogo de produtos com carrinho e checkout simulado.',
    'PHP, MariaDB, JavaScript',
    'https://github.com/usuario/loja',
    2024,
    'publicado'
),

(
    'API de Clima',
    'Microservico que consome uma API publica e devolve a previsao em JSON.',
    'PHP, REST',
    'https://github.com/usuario/clima',
    2026,
    'publicado'
),

(
    'Jogo da Velha (em construcao)',
    'Jogo da velha local - ainda em desenvolvimento.',
    'JavaScript, HTML',
    NULL,
    2026,
    'rascunho'
);


-- =========================================================
-- DADOS DAS TECNOLOGIAS
-- =========================================================

INSERT INTO tecnologias
(nome, categoria, descricao, ano_criacao)
VALUES

(
    'HTML',
    'Frontend',
    'Linguagem de marcacao para estrutura de paginas.',
    1993
),

(
    'CSS',
    'Frontend',
    'Linguagem de estilos para apresentacao visual.',
    1996
),

(
    'JavaScript',
    'Frontend',
    'Linguagem de programacao para o navegador.',
    1995
),

(
    'PHP',
    'Backend',
    'Linguagem server-side para web dinamica.',
    1994
),

(
    'MariaDB',
    'Banco de Dados',
    'SGBD relacional open-source.',
    2009
),

(
    'Git',
    'DevOps',
    'Sistema de controle de versao distribuido.',
    2005
);


-- =========================================================
-- CONFERENCIA DOS DADOS
-- =========================================================

SELECT id, nome, ano, status
FROM projetos;

SELECT id, nome, email
FROM usuarios;

SELECT id, nome, categoria, ano_criacao
FROM tecnologias;