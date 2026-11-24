import { useEffect, useState } from 'react';
import API from './api.js';

// NovoProjeto: formulário para cadastrar (POST) ou editar (PUT) um projeto na API.
function NovoProjeto({ token, projetoEmEdicao, onSalvo, onCancelarEdicao, onSessaoExpirada }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tecnologias, setTecnologias] = useState('');
  const [ano, setAno] = useState('');
  const [linkGithub, setLinkGithub] = useState('');
  const [aviso, setAviso] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (projetoEmEdicao) {
      setAviso('');
      setErro('');
      setNome(projetoEmEdicao.nome || '');
      setDescricao(projetoEmEdicao.descricao || '');
      setTecnologias(projetoEmEdicao.tecnologias || '');
      setAno(projetoEmEdicao.ano ? String(projetoEmEdicao.ano) : '');
      setLinkGithub(projetoEmEdicao.link_github || '');
    } else {
      setNome('');
      setDescricao('');
      setTecnologias('');
      setAno('');
      setLinkGithub('');
    }
  }, [projetoEmEdicao]);

  async function salvar(e) {
    e.preventDefault();
    setAviso('');
    setErro('');

    const editando = Boolean(projetoEmEdicao);
    const url = editando
      ? API + '/api/projetos/' + projetoEmEdicao.id
      : API + '/api/projetos';
    const metodo = editando ? 'PUT' : 'POST';

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          nome: nome,
          descricao: descricao,
          tecnologias: tecnologias,
          ano: ano ? Number(ano) : null,
          link_github: linkGithub,
        }),
      });

      if (resposta.status === 401) {
        onSessaoExpirada('Sua sessão expirou. Faça login novamente para salvar.');
        return;
      }

      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        throw new Error(dados.erro || 'A API respondeu ' + resposta.status);
      }

      setAviso(
        editando
          ? 'Projeto ' + projetoEmEdicao.id + ' atualizado.'
          : 'Projeto ' + dados.id + ' cadastrado.'
      );
      setNome('');
      setDescricao('');
      setTecnologias('');
      setAno('');
      setLinkGithub('');
      onSalvo();
    } catch (falha) {
      setErro('Não deu para salvar: ' + falha.message);
    }
  }

  return (
    <form onSubmit={salvar}>
      <h3>{projetoEmEdicao ? 'Editar projeto #' + projetoEmEdicao.id : 'Novo projeto'}</h3>
      <label>
        Nome
        <input name="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>
      <label>
        Descrição
        <textarea name="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </label>
      <label>
        Tecnologias
        <input name="tecnologias" value={tecnologias} onChange={(e) => setTecnologias(e.target.value)} />
      </label>
      <label>
        Ano
        <input
          name="ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />
      </label>
      <label>
        Link do GitHub
        <input
          name="link_github"
          type="url"
          placeholder="https://github.com/..."
          value={linkGithub}
          onChange={(e) => setLinkGithub(e.target.value)}
        />
      </label>
      <button type="submit">{projetoEmEdicao ? 'Salvar alterações' : 'Salvar'}</button>
      {projetoEmEdicao && (
        <button type="button" onClick={onCancelarEdicao}>
          Cancelar edição
        </button>
      )}
      {aviso && <p className="aviso">{aviso}</p>}
      {erro && <p className="erro">{erro}</p>}
    </form>
  );
}

export default NovoProjeto;