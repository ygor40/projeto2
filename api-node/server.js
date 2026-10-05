const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORTA = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API do Portfólio em Node: no ar');
});

// Buscar todos os projetos
app.get('/api/projetos', async (req, res) => {
  try {
    const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos";
    const [projetos] = await pool.query(sql);
    res.json(projetos);
  } catch (erro) {
    res.status(500).json({ erro: 'Falha no servidor: ' + erro.message });
  }
});

// Buscar um projeto pelo id
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

// POST cria: os dados vem no corpo, em JSON, e o id nasce no banco
app.post('/api/projetos', async (req, res) => {
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

// PUT altera: id vai no caminho (req.params) e o corpo traz os novos dados (req.body)
app.put('/api/projetos/:id', async (req, res) => {
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

// Catalogo de tecnologias
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