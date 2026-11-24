import { useEffect, useState } from 'react';
import API from './api.js';
import NovoProjeto from './NovoProjeto.jsx';

// Gestao: a área de quem cuida do Portfólio. Mora no endereço "/gestao".
function Gestao() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [erro, setErro] = useState('');

  const [projetos, setProjetos] = useState([]);
  const [carregandoProjetos, setCarregandoProjetos] = useState(false);
  const [erroProjetos, setErroProjetos] = useState('');
  const [erroAcao, setErroAcao] = useState('');
  const [projetoEmEdicao, setProjetoEmEdicao] = useState(null);

  function encerrarPorSessaoExpirada(mensagem) {
    localStorage.removeItem('token');
    setToken('');
    setProjetoEmEdicao(null);
    setErro(mensagem || 'Sua sessão expirou. Faça login novamente.');
  }

  async function buscarProjetos() {
    setCarregandoProjetos(true);
    setErroProjetos('');
    try {
      const resposta = await fetch(API + '/api/projetos');
      if (!resposta.ok) {
        throw new Error('A API respondeu ' + resposta.status);
      }
      const dados = await resposta.json();
      setProjetos(dados);
    } catch (falha) {
      setErroProjetos('Não deu para carregar os projetos: ' + falha.message);
    }
    setCarregandoProjetos(false);
  }

  useEffect(() => {
    if (token) {
      buscarProjetos();
    }
  }, [token]);

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

  function sair() {
    localStorage.removeItem('token');
    setToken('');
    setProjetoEmEdicao(null);
    setErro('');
  }

  async function excluirProjeto(id) {
    setErroAcao('');
    try {
      const resposta = await fetch(API + '/api/projetos/' + id, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token,
        },
      });

      if (resposta.status === 401) {
        encerrarPorSessaoExpirada('Sua sessão expirou. Faça login novamente para excluir.');
        return;
      }

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        throw new Error(dados.erro || 'A API respondeu ' + resposta.status);
      }

      setProjetos((listaAtual) => listaAtual.filter((p) => p.id !== id));
      if (projetoEmEdicao && projetoEmEdicao.id === id) {
        setProjetoEmEdicao(null);
      }
    } catch (falha) {
      setErroAcao('Não deu para excluir: ' + falha.message);
    }
  }

  function aoSalvarProjeto() {
    setProjetoEmEdicao(null);
    buscarProjetos();
  }

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

  return (
    <section className="gestao">
      <h2>Gestão</h2>
      <p>Você entrou. O token está guardado.</p>
      <button onClick={sair}>Sair</button>

      <NovoProjeto
        token={token}
        projetoEmEdicao={projetoEmEdicao}
        onSalvo={aoSalvarProjeto}
        onCancelarEdicao={() => setProjetoEmEdicao(null)}
        onSessaoExpirada={encerrarPorSessaoExpirada}
      />

      <h3>Projetos cadastrados</h3>
      {carregandoProjetos && <p>Carregando projetos...</p>}
      {erroProjetos && <p className="erro">{erroProjetos}</p>}
      {erroAcao && <p className="erro">{erroAcao}</p>}
      {!carregandoProjetos && !erroProjetos && projetos.length === 0 && (
        <p>Nenhum projeto cadastrado.</p>
      )}
      <ul>
        {projetos.map((p) => (
          <li key={p.id}>
            <strong>{p.nome}</strong> ({p.tecnologias} — {p.ano}){' '}
            <button type="button" onClick={() => setProjetoEmEdicao(p)}>
              Editar
            </button>{' '}
            <button type="button" onClick={() => excluirProjeto(p.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Gestao;