import { useEffect, useState } from 'react';
import API from './api.js';
import CardProjeto from './CardProjeto.jsx';
import Catalogo from './Catalogo.jsx';
import Contato from './Contato.jsx';

// Inicio: a tela pública do Portfólio. Mora no endereço "/".
function Inicio() {
  const [projetos, setProjetos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function buscarProjetos() {
    try {
      const resposta = await fetch(API + '/api/projetos');
      if (!resposta.ok) {
        throw new Error('A API respondeu ' + resposta.status);
      }
      const dados = await resposta.json();
      setProjetos(dados);
    } catch (falha) {
      setErro('Não deu para carregar os projetos: ' + falha.message);
    }
    setCarregando(false);
  }

  useEffect(() => {
    buscarProjetos();
  }, []);

  return (
    <>
      <h2>Projetos</h2>
      {carregando && <p>Carregando projetos...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && projetos.length === 0 && (
        <p>Nenhum projeto cadastrado no momento.</p>
      )}
      <div className="cards">
        {projetos.map((p) => (
          <CardProjeto
            key={p.id}
            nome={p.nome}
            descricao={p.descricao}
            tecnologias={p.tecnologias}
            link_github={p.link_github}
            ano={p.ano}
          />
        ))}
      </div>
      <Catalogo />
      <Contato />
    </>
  );
}

export default Inicio;