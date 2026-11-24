import { useEffect, useState } from 'react';
import API from './api.js';

// Catalogo: busca e exibe a lista de tecnologias da API.
function Catalogo() {
  const [tecnologias, setTecnologias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function buscarTecnologias() {
    try {
      const resposta = await fetch(API + '/api/tecnologias');
      if (!resposta.ok) {
        throw new Error('A API respondeu ' + resposta.status);
      }
      const dados = await resposta.json();
      setTecnologias(dados);
    } catch (falha) {
      setErro('Não deu para carregar o catálogo: ' + falha.message);
    }
    setCarregando(false);
  }

  useEffect(() => {
    buscarTecnologias();
  }, []);

  return (
    <section className="catalogo">
      <h2>Catálogo de tecnologias</h2>
      {carregando && <p>Carregando catálogo...</p>}
      {erro && <p className="erro">{erro}</p>}
      {!carregando && !erro && tecnologias.length === 0 && (
        <p>Nenhuma tecnologia cadastrada no catálogo.</p>
      )}
      <ul>
        {tecnologias.map((t) => (
          <li key={t.id}>
            {t.nome} - {t.categoria}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Catalogo;