# Portfólio — API em Node.js + Express, MariaDB e React

Projeto full-stack composto por:
- **`api-node/`**: API REST em **Node.js + Express** conectada ao **MariaDB**, com autenticação via **JWT** (`jsonwebtoken`) e senhas criptografadas com **`bcryptjs`**.
- **`portfolio-react/`**: Front-end em **React + Vite** com navegação SPA via **`react-router-dom`** (`Inicio`, `Gestao` e `NaoEncontrada`), integrado à API via `src/api.js` e com CRUD autenticado de projetos (`Gestao` + `NovoProjeto`).
- **`portfolio-angular/`**: Versão anterior em Angular + PHP (histórico das atividades iniciais).

---

## Como rodar tudo do zero (na ordem)

### 1. Iniciar o MariaDB e criar o banco e as tabelas
Na raiz do repositório (`/workspaces/projeto2`), inicie o serviço do banco e importe os scripts SQL:

```bash
sudo service mariadb start
sudo mariadb < portfolio-angular/sql/setup.sql
sudo mariadb dwii_db < portfolio-angular/sql/usuarios.sql
```

### 2. Instalar dependências da API Node e criar o usuário do login
Entre na pasta `api-node/`, instale os pacotes (`express`, `cors`, `mysql2`, `bcryptjs`, `jsonwebtoken`) e cadastre o usuário administrador (substitua `<email>` e `<senha>` pelas suas credenciais):

```bash
cd api-node
npm install
node criar-usuario.js <email> <senha>
```

### 3. Iniciar o servidor da API (`api-node/`)
Ainda dentro de `api-node/`, inicie a API na porta **3000**:

```bash
node server.js
```

### 4. Liberar a porta 3000 como Public (GitHub Codespaces)
Na aba **Ports** do Codespaces, altere a visibilidade da porta **3000** de *Private* para **Public** e copie a URL gerada.

### 5. Configurar o endereço da API no front (`portfolio-react/src/api.js`)
Abra `portfolio-react/src/api.js` e confira se a constante `API` aponta para a URL pública da porta **3000** (ou `http://localhost:3000` em ambiente local).

### 6. Instalar dependências e subir o front-end React (`portfolio-react/`)
Em outro terminal, entre na pasta `portfolio-react/`, instale os pacotes e inicie o servidor Vite na porta **5173**:

```bash
cd portfolio-react
npm install
npm run dev
```

---

## Endereços do Front-end (Rotas)

- **`/` (`Inicio.jsx`)**: tela pública do portfólio; lista os projetos publicados (`GET /api/projetos`) com aviso quando não há projetos cadastrados, exibe o catálogo de tecnologias (`GET /api/tecnologias`) e o formulário de contato (`Contato.jsx`).
- **`/gestao` (`Gestao.jsx`)**: área administrativa; realiza login (`POST /api/login`), salva o token JWT no `localStorage`, permite cadastrar (`POST`), editar (`PUT`) e excluir (`DELETE`) projetos sem recarregar a página, e encerra a sessão voltando ao login caso a API responda `401`.
- **`*` (`NaoEncontrada.jsx`)**: tela exibida para qualquer endereço inexistente, com link (`<Link to="/">`) para retornar à página inicial.

---

## Tela × Pedido à API × Precisa de token

| Tela / Ação | Pedido à API | Precisa de token? |
| :--- | :--- | :--- |
| `/` (`Inicio.jsx`) — listar projetos | `GET /api/projetos` | Não |
| `/` (`Catalogo.jsx`) — listar tecnologias | `GET /api/tecnologias` | Não |
| `/gestao` (`Gestao.jsx`) — fazer login | `POST /api/login` | Não |
| `/gestao` (`Gestao.jsx`) — listar projetos na gestão | `GET /api/projetos` | Não |
| `/gestao` (`NovoProjeto.jsx`) — cadastrar projeto | `POST /api/projetos` | Sim (`Authorization: Bearer`) |
| `/gestao` (`NovoProjeto.jsx`) — editar projeto | `PUT /api/projetos/:id` | Sim (`Authorization: Bearer`) |
| `/gestao` (`Gestao.jsx`) — excluir projeto | `DELETE /api/projetos/:id` | Sim (`Authorization: Bearer`) |

---

## Por que esconder a tela de gestão não protege os dados

Ocultar os botões ou a rota `/gestao` no React é apenas uma barreira visual no navegador, pois qualquer pessoa pode inspecionar o código ou chamar a API diretamente via `curl` ou Postman. Quem realmente protege os dados é o servidor (`api-node/server.js`), que exige e valida a assinatura do token JWT no cabeçalho `Authorization` antes de gravar, editar ou excluir registros no banco.

---

## O que este front ainda não faz

1. **Envio real do formulário de contato (`Contato.jsx`):** atualmente os campos são controlados em estado e exibem apenas uma confirmação local, sem enviar os dados para um endpoint de gravação na API.
2. **Gestão de tecnologias e controle de rascunhos:** a tela `/gestao` gerencia apenas os projetos publicados (`GET /api/projetos`), sem interface para cadastrar/editar tecnologias (`POST/PUT/DELETE /api/tecnologias`) nem alternar o `status` de projetos entre `rascunho` e `publicado`.

---

## Endpoints e Exemplos de `curl -i` com Respostas

### 1. Verificar se a API está no ar (`GET /` — pública)
```bash
curl -i http://localhost:3000/
```
Resposta:
```http
HTTP/1.1 200 OK

API do Portfólio em Node: no ar
```

### 2. Listar projetos publicados (`GET /api/projetos` — pública)
Retorna apenas projetos com `status = 'publicado'`:
```bash
curl -i http://localhost:3000/api/projetos
```
Resposta:
```http
HTTP/1.1 200 OK

[{"id":1,"nome":"Portfólio Angular","descricao":"Meu portfólio com Angular e Angular Material.","tecnologias":"Angular, TypeScript","link_github":"[https://github.com/ygor40/projeto2](https://github.com/ygor40/projeto2)","ano":2026}]
```

### 3. Consultar projeto por ID (`GET /api/projetos/:id` — pública)
```bash
curl -i http://localhost:3000/api/projetos/1
```
Resposta:
```http
HTTP/1.1 200 OK

{"id":1,"nome":"Portfólio Angular","descricao":"Meu portfólio com Angular e Angular Material.","tecnologias":"Angular, TypeScript","link_github":"[https://github.com/ygor40/projeto2](https://github.com/ygor40/projeto2)","ano":2026}
```

### 4. Listar catálogo de tecnologias (`GET /api/tecnologias` — pública)
```bash
curl -i http://localhost:3000/api/tecnologias
```
Resposta:
```http
HTTP/1.1 200 OK

[{"id":1,"nome":"Node.js","categoria":"Backend","descricao":"Ambiente de execução JavaScript","ano_criacao":2009}]
```

### 5. Realizar login e obter o Token JWT (`POST /api/login` — pública)
```bash
curl -i -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<email>","senha":"<senha>"}'
```
Resposta:
```http
HTTP/1.1 200 OK

{"token":"<seu_token_jwt>"}
```

*(Para facilitar os testes seguintes no terminal, salve o token numa variável: `TOKEN="<seu_token_jwt>"`)*

### 6. Tentar criar projeto sem token (`POST /api/projetos` — bloqueada pelo middleware `autenticar`)
```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Sem Token"}'
```
Resposta:
```http
HTTP/1.1 401 Unauthorized

{"erro":"Token ausente"}
```

### 7. Criar projeto autenticado (`POST /api/projetos` — protegida)
```bash
curl -i -X POST http://localhost:3000/api/projetos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto Autenticado","descricao":"Criado via API Node","tecnologias":"Node.js, Express, MariaDB","link_github":"[https://github.com/ygor40/projeto2](https://github.com/ygor40/projeto2)","ano":2026}'
```
Resposta:
```http
HTTP/1.1 201 Created

{"id":12}
```

### 8. Atualizar projeto autenticado (`PUT /api/projetos/:id` — protegida)
```bash
curl -i -X PUT http://localhost:3000/api/projetos/12 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Projeto Atualizado","descricao":"Editado via PUT","tecnologias":"Node.js, Express","ano":2026}'
```
Resposta:
```http
HTTP/1.1 200 OK

{"mensagem":"Projeto atualizado"}
```

### 9. Excluir projeto autenticado (`DELETE /api/projetos/:id` — protegida)
```bash
curl -i -X DELETE http://localhost:3000/api/projetos/12 \
  -H "Authorization: Bearer $TOKEN"
```
Resposta:
```http
HTTP/1.1 204 No Content
```

---

## Histórico das Aulas (Front-end React)

### Aula 26: estado, lista e formulário
Os projetos saíram do `App.jsx` e passaram a ser desenhados com `map()` e `key`. O formulário de contato (`src/Contato.jsx`) guarda o que a pessoa digita no estado (`useState`).

### Aula 27: os projetos vêm da API
O front busca os projetos e o catálogo na API em Node, com `fetch` dentro de `useEffect(..., [])`, tratando carregamento (`carregando`), erro (`erro`) e `resposta.ok`. O endereço da API fica centralizado em `src/api.js`.

### Aula 28: rotas, login e CRUD de projetos
O front usa `react-router-dom` com as rotas `/`, `/gestao` e `*`. Na área de gestão (`Gestao.jsx` e `NovoProjeto.jsx`), o login pede o token (`POST /api/login`), guarda no `localStorage` e permite cadastrar (`POST`), editar (`PUT`) e excluir (`DELETE`) projetos com os cinco campos do contrato, encerrando a sessão se a API responder `401`.

---

## Estrutura do Projeto

```text
projeto2/
├── README.md
├── api-node/
│   ├── criar-usuario.js
│   ├── db.js
│   ├── package.json
│   └── server.js
├── portfolio-react/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Cabecalho.jsx
│   │   ├── CardProjeto.jsx
│   │   ├── Catalogo.jsx
│   │   ├── Contato.jsx
│   │   ├── Gestao.jsx
│   │   ├── Inicio.jsx
│   │   ├── NaoEncontrada.jsx
│   │   ├── NovoProjeto.jsx
│   │   ├── Rodape.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
└── portfolio-angular/
    ├── api/
    ├── sql/
    │   ├── setup.sql
    │   └── usuarios.sql
    └── src/
```

---

## Histórico — Atividade 15 (Portfólio Angular + API PHP)

<details>
<summary>Clique para expandir a documentação da Atividade 15</summary>

### Funcionalidades e Operações
- Rota `/gestao` com formulário único (`editandoId`) para criar (`POST`), editar (`PUT`), listar (`GET`) e excluir (`DELETE`) projetos via `ProjetoService` (`portfolio-angular/src/app/services/projeto.ts`).
- Validação dos campos `Nome` (mínimo 3 caracteres) e `Ano` (entre 2000 e 2100).
- Atualização automática da lista após salvar (`carregar()` + `cancelarEdicao()`) e remoção imediata no `DELETE` via `filter()`, com diálogo de confirmação.

### Evidências e Autoavaliação (Atividade 15)
- **Conceito pretendido:** C
- **R1:** API PHP (`portfolio-angular/api/projetos.php`) com `GET`, `POST`, `PUT`, `DELETE` e `PDO` (`prepare()` / `execute()`).
- **R2:** Tela `/gestao` separando interface (`gestao.ts`) e chamadas HTTP (`projeto.ts`).
- **R3:** Atualização reativa sem F5.
- **R4:** Evidências de Network (`POST 201 Created`) e consulta SQL (`SELECT id, nome, ano, status FROM dwii_db.projetos;`).

</details>

---

# Autor

**Ygor Gustavo Alves de Freitas**

Uso de IA: utilizei o Gemini para auxiliar na estruturação dos componentes e operações de edição/exclusão em React e na revisão deste README.