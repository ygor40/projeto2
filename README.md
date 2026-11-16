# Portfólio — API em Node.js + Express, MariaDB e React

Projeto full-stack composto por:
- **`api-node/`**: API REST em **Node.js + Express** conectada ao **MariaDB**, com autenticação via **JWT** (`jsonwebtoken`) e senhas criptografadas com **`bcryptjs`**.
- **`portfolio-react/`**: Front-end em **React + Vite** organizado em componentes (`Cabecalho`, `CardProjeto` e `Rodape`).
- **`portfolio-angular/`**: Versão anterior em Angular + PHP (histórico das atividades iniciais).

---

## Como rodar a API Node (`api-node/`) do zero

### 1. Iniciar o MariaDB e criar o banco e as tabelas
Na raiz do repositório (`/workspaces/projeto2`), inicie o serviço do banco e importe os scripts SQL:

```bash
sudo service mariadb start
sudo mariadb < portfolio-angular/sql/setup.sql
sudo mariadb dwii_db < portfolio-angular/sql/usuarios.sql
```

### 2. Instalar as dependências da API Node
Entre na pasta `api-node/` e instale os pacotes (`express`, `cors`, `mysql2`, `bcryptjs`, `jsonwebtoken`):

```bash
cd api-node
npm install
```

### 3. Criar o usuário administrador
Cadastre o dono do portfólio no banco utilizando o script `criar-usuario.js`:

```bash
node criar-usuario.js dono@portfolio.dev portfolio2026
```

### 4. Iniciar o servidor da API
```bash
node server.js
```

A API ficará disponível em:
```text
http://localhost:3000
```

*(No GitHub Codespaces, certifique-se de que a porta **3000** está com visibilidade **Public** na aba **Ports**.)*

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
  -d '{"email":"dono@portfolio.dev","senha":"portfolio2026"}'
```
Resposta:
```http
HTTP/1.1 200 OK

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkb25vQHBvcnRmb2xpby5kZXYiLCJpYXQiOjE3NzAwMDAwMDB9.assinatura_jwt"}
```

*(Para facilitar os testes seguintes no terminal, salve o token numa variável: `TOKEN="cole_o_token_aqui"`)*

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
  -d '{"nome":"Projeto Autenticado","descricao":"Criado via API Node","tecnologias":"Node.js, Express, MariaDB","ano":2026}'
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

## Como rodar o Front-end em React (`portfolio-react/`)

Em outro terminal, entre na pasta `portfolio-react/` e inicie o servidor Vite:

```bash
cd portfolio-react
npm install
npm run dev
```

A aplicação abre na porta **5173** (`http://localhost:5173`).

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
│   │   ├── Rodape.jsx
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