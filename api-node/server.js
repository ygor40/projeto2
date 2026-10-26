const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const PORTA = 3000;
const SEGREDO = 'troque-por-uma-frase-longa-que-so-voce-sabe';

app.use(cors());
app.use(express.json());

// Middleware para conferir o token antes da rota
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization ?? '';
  const token = cabecalho.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ erro: 'Token ausente' });
  }

  try {
    req.usuario = jwt.verify(token, SEGREDO);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token invalido ou expirado' });
  }
}

app.get('/', (req, res) => {
  res.send('API do Portfólio em Node: no ar');
});

// Rota de Login (Autenticação)
app.post('/api/login', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.email || !dados.senha) {
      return res.status(400).json({ erro: 'Informe email e senha' });
    }

    const [linhas] = await pool.query(
      'SELECT id, email, senha_hash FROM usuarios WHERE email = ?',
      [dados.email]
    );

    if (!linhas.length) {
      return res.status(401).json({ erro: 'Email ou senha invalidos' });
    }

    const usuario = linhas[0];
    const confere = await bcrypt.compare(dados.senha, usuario.senha_hash);

    if (!confere) {
      return res.status(401).json({ erro: 'Email ou senha invalidos' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SEGREDO
    );

    res.json({ token });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Buscar todos os projetos (Rota pública)
app.get('/api/projetos', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos";
    const [projetos] = await pool.query(sql);
    res.json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Buscar um projeto pelo id (Rota pública)
app.get('/api/projetos/:id', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos WHERE id = ?";
    const [linhas] = await pool.execute(sql, [req.params.id]);

    if (linhas.length === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    res.json(linhas[0]);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// POST cria (Rota protegida por autenticar)
app.post('/api/projetos', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = "INSERT INTO projetos (nome, descricao, tecnologias, link_github, ano, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? null,
      dados.ano ?? new Date().getFullYear(),
      'publicado'
    ]);

    res.status(201).json({ id: resultado.insertId });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// PUT altera (Rota protegida por autenticar)[cite: 12]
app.put('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const dados = req.body;
    if (!dados || !dados.nome) {
      return res.status(400).json({ erro: 'Informe pelo menos o nome do projeto' });
    }

    const sql = "UPDATE projetos SET nome = ?, descricao = ?, tecnologias = ?, link_github = ?, ano = ? WHERE id = ?";
    const [resultado] = await pool.execute(sql, [
      dados.nome,
      dados.descricao ?? '',
      dados.tecnologias ?? '',
      dados.link_github ?? null,
      dados.ano ?? new Date().getFullYear(),
      req.params.id
    ]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    res.json({ mensagem: 'Projeto atualizado' });
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// DELETE apaga (Rota protegida por autenticar)[cite: 12]
app.delete('/api/projetos/:id', autenticar, async (req, res) => {
  try {
    const [resultado] = await pool.execute('DELETE FROM projetos WHERE id = ?', [req.params.id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Projeto nao encontrado' });
    }

    res.status(204).end();
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Catalogo de tecnologias (Rota pública)
app.get('/api/tecnologias', async (req, res) => {
  try {
    const sql = "SELECT id, nome, categoria, descricao, ano_criacao FROM tecnologias";
    const [tecnologias] = await pool.query(sql);
    res.json(tecnologias);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

app.listen(PORTA, () => {
  console.log(`API no ar em http://localhost:${PORTA}`);
});