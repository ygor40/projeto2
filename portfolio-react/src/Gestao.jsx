import { useState } from 'react';
import API from './api.js';
import NovoProjeto from './NovoProjeto.jsx';

// Gestao: a área de quem cuida do Portfólio. Mora no endereço "/gestao".
function Gestao() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [erro, setErro] = useState('');

  // entrar: manda email e senha para a API. Se conferem, ela devolve o token.
  async function entrar(e) {
    e.preventDefault();
    setErro('');
    try {
      const resposta = await fetch(API + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, senha: senha }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.erro);
      }
      localStorage.setItem('token', dados.token);
      setToken(dados.token);
    } catch (falha) {
      setErro('Não deu para entrar: ' + falha.message);
    }
  }

  // sair: joga o token fora, no navegador e no estado.
  function sair() {
    localStorage.removeItem('token');
    setToken('');
  }

  // Sem token, a tela é o formulário de login.
  if (!token) {
    return (
      <section className="gestao">
        <h2>Gestão</h2>
        <form onSubmit={entrar}>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Senha
            <input
              name="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
        {erro && <p className="erro">{erro}</p>}
      </section>
    );
  }

  // Com token, a tela é a área de gestão.
  return (
    <section className="gestao">
      <h2>Gestão</h2>
      <p>Você entrou. O token está guardado.</p>
      <NovoProjeto token={token} />
      <button onClick={sair}>Sair</button>
    </section>
  );
}

export default Gestao;