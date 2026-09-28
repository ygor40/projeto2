const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORTA = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('API do Portfólio em Node: no ar');
});

// Rota atualizada para buscar os projetos diretamente do banco de dados MariaDB
app.get('/api/projetos', async (req, res) => {
  const sql = "SELECT id, nome, descricao, tecnologias, link_github, ano FROM projetos";
  const [projetos] = await pool.query(sql);
  res.json(projetos);
});

app.listen(PORTA, () => {
  console.log(`API no ar em http://localhost:${PORTA}`);
});