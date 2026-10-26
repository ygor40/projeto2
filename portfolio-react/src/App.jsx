import Cabecalho from './Cabecalho.jsx';
import CardProjeto from './CardProjeto.jsx';
import Rodape from './Rodape.jsx';

// App: o componente raiz. Ele monta a página com os outros componentes.
function App() {
  return (
    <>
      <Cabecalho />
      <main>
        <h2>Projetos</h2>
        <div className="cards">
          <CardProjeto
            nome="Portfólio Angular"
            descricao="Meu portfólio com Angular e Angular Material."
            tecnologias="Angular, TypeScript"
            link_github="https://github.com/seu-usuario/2026-DwII-portfolio-angular"
            ano={2026}
          />
          <CardProjeto
            nome="API do Portfólio em PHP"
            descricao="Endpoints de projetos e catálogo com PDO e MariaDB."
            tecnologias="PHP, MariaDB"
            link_github={null}
            ano={2026}
          />
          <CardProjeto
            nome="Sistema de Cadastro v1"
            descricao="CRUD em PHP do 1º trimestre."
            tecnologias="PHP, MariaDB, Bootstrap"
            link_github={null}
            ano={2026}
          />
        </div>
      </main>
      <Rodape />
    </>
  );
}

export default App;