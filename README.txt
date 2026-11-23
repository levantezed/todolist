TODO LIST
=========

Aplicação de lista de tarefas com backend em Node.js (Fastify + MySQL)
e frontend em React + Vite.

Estrutura do projeto
--------------------
  backend/    API REST (Fastify + mysql2)
  frontend/   Interface (React + Vite)


FUNCIONALIDADES
---------------
  - Listagem de tarefas com contadores de total e concluídas
  - Criar tarefa por modal ("Create Task"), com data limite opcional
  - Editar tarefa por modal ("Edit Task"), pelo botão de lápis
  - Excluir tarefa
  - Marcar/desmarcar como concluída (checkbox com gradiente)
  - Busca em tempo real com debounce (400 ms)
  - Ordenação automática: data limite mais próxima primeiro
  - Tarefas em atraso: título em vermelho e selo "Em atraso"
  - Botões de editar/excluir aparecem ao passar o mouse
  - Estado vazio: "You have no pending tasks."
  - Botão flutuante "+" no canto inferior direito


REQUISITOS
----------
  - Node.js 18 ou superior (https://nodejs.org)
  - XAMPP (https://www.apachefriends.org) com o módulo MySQL


1) BANCO DE DADOS (XAMPP)
-------------------------
  1. Abra o XAMPP Control Panel e clique em "Start" no módulo MySQL.
     (O Apache não é necessário, a menos que queira usar o phpMyAdmin.)

  2. Crie o banco e a tabela, de uma destas formas:

     a) Pelo phpMyAdmin:
        - Acesse http://localhost/phpmyadmin
        - Clique na aba "Importar"
        - Escolha o arquivo backend/schema.sql e clique em "Importar"

     b) Pelo terminal (na pasta do XAMPP, ex.: C:\xampp\mysql\bin):
          mysql -u root < caminho\do\projeto\backend\schema.sql

  O script cria o banco "todolist" e a tabela "tasks".

  O XAMPP usa, por padrão, usuário "root" SEM senha na porta 3306. Esses
  já são os valores padrão do backend, então não precisa configurar nada
  se o seu XAMPP estiver com a instalação padrão.


2) BACKEND
----------
  cd backend
  npm install
  npm run dev

  A API sobe em http://localhost:3333
  Teste em: http://localhost:3333/health  (deve responder {"status":"ok"})

  Configuração opcional (somente se o seu MySQL for diferente do padrão):
  crie um arquivo ".env" dentro de backend/ com:

    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=todolist
    PORT=3333
    CORS_ORIGIN=http://localhost:5173

  IMPORTANTE - CORS: em backend/src/server.js, o registro do CORS precisa
  liberar os métodos PATCH e DELETE, senão o navegador bloqueia marcar
  como concluída, editar e excluir. Deve ficar assim:

    await app.register(cors, {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    });


3) FRONTEND
-----------
  Em outro terminal:

  cd frontend
  npm install
  npm run dev

  Acesse http://localhost:5173

  A URL da API é lida da variável VITE_API_URL. Se o backend estiver em
  outro endereço, crie frontend/.env com:

    VITE_API_URL=http://localhost:3333

  Para gerar a versão de produção:  npm run build


ENDPOINTS DA API
----------------
  GET     /api/tasks?search=texto   Lista tarefas (retorna tasks, total, completed)
  POST    /api/tasks                Cria tarefa      { title, dueDate? }
  PATCH   /api/tasks/:id            Atualiza tarefa  { completed?, title?, dueDate? }
  DELETE  /api/tasks/:id            Exclui tarefa
  GET     /health                   Verifica se a API está no ar

  O arquivo backend/rotas.http traz exemplos para testar (extensão
  "REST Client" do VS Code).


PROBLEMAS COMUNS
----------------
  "Could not reach the server" na tela
    -> O backend não está rodando, ou o MySQL do XAMPP não foi iniciado.

  Marcar, editar ou excluir não funciona (erro de CORS no console)
    -> Aplique a correção de CORS descrita na seção do backend.

  Erro ECONNREFUSED ao iniciar o backend
    -> O MySQL do XAMPP está parado. Inicie-o no Control Panel.

  Erro "Access denied for user 'root'"
    -> Você definiu senha para o root. Informe-a em DB_PASSWORD no .env
       do backend.

  Porta 3306 em uso
    -> Outro MySQL está rodando. Pare-o ou altere a porta no XAMPP e
       ajuste DB_PORT no .env.
