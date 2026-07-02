🧸 Sistema Dome & Kids - Brechó Infantil

Status do Projeto: Concluído e Entregue ✔️

📖 Sobre a Aplicação

O Dome & Kids é um sistema web desenvolvido em Node.js para gerenciamento de estoque e registro de vendas de um brechó infantil. Este projeto foi desenvolvido do zero como método avaliativo para a disciplina de Programação II, estruturando novos módulos de negócio (Roupas, Clientes e Vendas) e garantindo a persistência e integridade dos dados através do banco de dados SQLite.

🎯 Entregáveis e Critérios de Avaliação

O projeto foi estruturado para atender a 100% dos requisitos solicitados na especificação da atividade:
* **CRUD Completo de Roupas:** Desenvolvido do zero. Permite cadastrar, listar em formato de etiquetas, editar e excluir peças. Possui filtros por nome e categoria, além de controle estrito de quantidade.
* **CRUD Completo de Clientes:** Totalmente funcional e integrado, permitindo o gerenciamento e a listagem de todas as informações de contato dos clientes cadastrados na base de dados.
* **Módulo Avançado de Vendas:** Implementação de carrinho de compras com múltiplas peças, seleção de cliente/forma de pagamento e finalização da venda com baixa automática e em tempo real no estoque.
* **Estorno e Cancelamento:** Sistema inteligente de exclusão de vendas que cancela a transação e devolve automaticamente os itens de volta ao estoque de origem.
* **Dashboard Estatístico:** Painel principal com cartões informativos dinâmicos consumindo dados reais do banco (totalizadores de peças em estoque, clientes, vendas realizadas e receita total acumulada).
* **Organização do Código e Padrão Visual:** Manutenção estrita da identidade visual lúdica em tons pastéis (azul e rosa claros), estruturada em arquitetura modular (controllers e rotas isoladas por assunto) e frontend em JS Puro integrado via Fetch API.
* **Uso Correto do Git/GitHub:** Versionamento limpo e colaborativo, com commits sequenciais organizados para demonstrar a evolução do desenvolvimento.

💻 Tecnologias Utilizadas

| Tecnologia | Finalidade |
| :--- | :--- |
| Node.js | Ambiente de execução do servidor back-end |
| Express | Framework para criação de rotas e middlewares da API REST |
| SQLite (`node:sqlite`) | Banco de dados relacional embarcado (módulo nativo do Node.js) |
| HTML5 / CSS3 | Estruturação e estilização responsiva nativa (sem frameworks) |
| JavaScript Vanilla | Manipulação dinâmica do DOM e integração assíncrona com Fetch API |

⚙️ Instruções de Instalação e Execução

Para rodar o projeto localmente, siga o passo a passo abaixo:

1. Preparando o Ambiente
Certifique-se de ter o Node.js instalado em sua máquina na versão 22.5 ou superior (obrigatório para suporte ao módulo nativo `node:sqlite`).

2. Configurando o Diretório
Abra o terminal do seu sistema operacional ou do VS Code e navegue até a pasta do back-end do projeto:
```bash
cd backend
```
Instalação de Dependências
Dentro da pasta backend, execute o comando abaixo para baixar os pacotes necessários listados no package.json:
```bash
npm install
```
Configuração do Banco de Dados
Não é necessário instalar nenhum SGBD externo. O arquivo de banco de dados (dome_kids.db) será criado automaticamente na primeira execução do servidor, estruturando as tabelas e inserindo os dados de teste a partir do script contido em backend/db/dump.sql.
(Nota: O aviso de ExperimentalWarning: SQLite no terminal é normal devido ao recurso nativo do Node e não afeta a execução).

Executando o Servidor (Back-end)
Ainda no terminal da pasta backend, inicie a API do sistema com o comando:
```bash
npm start
```
O servidor passará a rodar em: http://localhost:3000

Acesso ao Sistema (Front-end)
Com o back-end rodando em segundo plano, abra a pasta frontend e execute o arquivo index.html diretamente no seu navegador, ou clique com o botão direito nele e selecione Open with Live Server no VS Code.

👨‍💻 Integrantes do Grupo

Desenvolvido por:

Anna

Projeto acadêmico desenvolvido para a disciplina de Programação II.
