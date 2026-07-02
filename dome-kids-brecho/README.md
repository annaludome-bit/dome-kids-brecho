# Dome & Kids — Sistema de Gestão e Vendas para Brechó Infantil

Sistema web completo (front-end + back-end + banco de dados) desenvolvido para a disciplina
**Programação II – 2026/01 · Sistemas de Informação · UEMG – Unidade Passos**.

O sistema permite gerenciar o estoque de peças de um brechó infantil, cadastrar clientes e
registrar vendas, com baixa automática de estoque.

## Estrutura do projeto

```
dome-kids-brecho/
├── backend/                 # API REST (Node.js + Express + SQLite)
│   ├── server.js             # Ponto de entrada, liga todas as rotas
│   ├── package.json
│   ├── db/
│   │   ├── database.js       # Conexão com o banco (SQLite)
│   │   └── dump.sql          # Script de criação e população do banco
│   ├── controllers/
│   │   ├── roupasController.js
│   │   ├── clientesController.js
│   │   └── vendasController.js
│   └── routes/
│       ├── roupasRoutes.js
│       ├── clientesRoutes.js
│       └── vendasRoutes.js
├── frontend/                 # Interface web (HTML + CSS + JS puro)
│   ├── index.html             # Painel / dashboard
│   ├── roupas.html            # Cadastro de roupas
│   ├── clientes.html          # Cadastro de clientes
│   ├── vendas.html            # Registro de vendas e histórico
│   ├── css/style.css
│   └── js/
│       ├── api.js             # Comunicação com a API
│       ├── roupas.js
│       ├── clientes.js
│       └── vendas.js
└── README.md
```

Cada função do sistema fica em um arquivo próprio (uma "aba" por assunto), tanto no
back-end (controller + rota separados por módulo) quanto no front-end (uma página HTML e
um arquivo JS por tela), conectados apenas pelos links do menu e pelas chamadas à API.

## Tecnologias utilizadas

- **Front-end:** HTML5, CSS3 (responsivo, sem frameworks) e JavaScript puro (Fetch API)
- **Back-end:** Node.js + Express
- **Banco de dados:** SQLite (via `better-sqlite3`)

## Como executar a aplicação

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior recomendada)
- VS Code (ou outro editor de sua preferência)

### 2. Configuração do banco de dados

O banco (`dome_kids.db`) é criado **automaticamente** na primeira execução do back-end,
a partir do script `backend/db/dump.sql`, que cria as tabelas e insere dados de exemplo.
Não é necessário instalar nenhum SGBD separado — o SQLite roda em um único arquivo.

Caso queira recriar o banco do zero, basta apagar o arquivo `backend/db/dome_kids.db`
(ele será gerado novamente ao iniciar o servidor).

### 3. Como executar o back-end

```bash
cd backend
npm install
npm start
```

O servidor sobe em: **http://localhost:3000**

Você pode testar se está no ar acessando `http://localhost:3000` no navegador — deve
aparecer `{"mensagem":"API Dome & Kids no ar!","versao":"1.0.0"}`.

### 4. Como executar o front-end

O front-end é HTML/CSS/JS puro, sem necessidade de build. Basta abrir o arquivo
`frontend/index.html` no navegador, ou (recomendado) usar a extensão **Live Server**
do VS Code, clicando com o botão direito em `index.html` → **Open with Live Server**.

> **Importante:** o back-end precisa estar rodando (`npm start` na pasta `backend`)
> para que as telas consigam carregar e salvar dados.

### 5. URLs do sistema

| Recurso            | URL                                    |
|---------------------|-----------------------------------------|
| API (back-end)      | http://localhost:3000                  |
| Painel (front-end)  | frontend/index.html                    |
| Cadastro de Roupas  | frontend/roupas.html                   |
| Clientes            | frontend/clientes.html                 |
| Vendas              | frontend/vendas.html                   |

## Principais funcionalidades

- **Cadastro de Roupas:** cadastro, listagem em cartões estilo "etiqueta", edição, exclusão,
  filtro por nome/categoria e controle de estoque por peça.
- **Clientes:** cadastro, listagem em tabela, edição e exclusão dos dados de contato.
- **Vendas:** montagem de carrinho com múltiplas peças, seleção de cliente e forma de
  pagamento, finalização da venda com baixa automática de estoque, histórico completo de
  vendas com detalhes por item, e cancelamento de venda (devolve as peças ao estoque).
- **Painel (dashboard):** resumo com total de peças em estoque, clientes cadastrados,
  vendas realizadas e receita total.
- Interface **responsiva**, adaptada para desktop, tablet e celular.

## Endpoints disponíveis

Todos os endpoints retornam e recebem dados em **JSON**.

### Roupas (`/roupas`)

| Método | Rota                 | Finalidade                          | Exemplo de requisição (body) |
|--------|-----------------------|--------------------------------------|-------------------------------|
| GET    | `/roupas/listar`      | Lista todas as peças                 | —                              |
| GET    | `/roupas/buscar/:id`  | Busca uma peça específica            | —                              |
| POST   | `/roupas/salvar`      | Cadastra uma nova peça                | `{ "nome": "Vestido Xadrez", "categoria": "Menina", "tamanho": "4", "cor": "Vermelho", "condicao": "Seminovo", "preco": 34.90, "quantidade": 2, "descricao": "..." }` |
| PUT    | `/roupas/editar/:id`  | Atualiza uma peça existente           | mesmos campos do POST (parciais são aceitos) |
| DELETE | `/roupas/deletar/:id` | Remove uma peça                       | —                              |

### Clientes (`/clientes`)

| Método | Rota                    | Finalidade                        | Exemplo de requisição (body) |
|--------|--------------------------|------------------------------------|-------------------------------|
| GET    | `/clientes/listar`       | Lista todos os clientes            | —                              |
| GET    | `/clientes/buscar/:id`   | Busca um cliente específico        | —                              |
| POST   | `/clientes/salvar`       | Cadastra um novo cliente            | `{ "nome": "Mariana Souza", "telefone": "(35) 99123-4567", "email": "mariana@email.com" }` |
| PUT    | `/clientes/editar/:id`   | Atualiza um cliente existente       | mesmos campos do POST |
| DELETE | `/clientes/deletar/:id`  | Remove um cliente                   | —                              |

### Vendas (`/vendas`)

| Método | Rota                  | Finalidade                                         | Exemplo de requisição (body) |
|--------|------------------------|------------------------------------------------------|-------------------------------|
| GET    | `/vendas/listar`       | Lista todas as vendas                                | —                              |
| GET    | `/vendas/buscar/:id`   | Busca uma venda com todos os itens do carrinho       | —                              |
| POST   | `/vendas/salvar`       | Registra uma nova venda e dá baixa no estoque         | `{ "cliente_id": 1, "forma_pagamento": "Pix", "itens": [{ "roupa_id": 2, "quantidade": 1 }] }` |
| PUT    | `/vendas/editar/:id`   | Atualiza forma de pagamento / status da venda         | `{ "forma_pagamento": "Dinheiro", "status": "Concluida" }` |
| DELETE | `/vendas/deletar/:id`  | Cancela a venda e devolve os itens ao estoque         | —                              |

### Exemplo de retorno (padrão JSON)

```json
{
  "id": 1,
  "nome": "Vestido Xadrez Manga Longa",
  "categoria": "Menina",
  "tamanho": "4",
  "preco": 34.9,
  "quantidade": 2
}
```

## Observações

- Todas as regras de negócio (validações, cálculo de total da venda, baixa de estoque,
  devolução em cancelamentos) ficam centralizadas no back-end, nos arquivos da pasta
  `controllers/`.
- O front-end apenas consome a API através do arquivo `frontend/js/api.js`.
- Projeto individual e autoral, desenvolvido como Projeto Avaliativo de Programação II.
