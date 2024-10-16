## Todo API
Api para gerenciamento de tarefas 📝

### Pré-requisitos
- NodeJS (v18 ou superior)
- Npm (v10 ou superior)

### Instalação

1. Clone o repositório *(\*necessário ter o git instalado em sua máquina)*:

```bash
git clone https://github.com/janssenbatista/TrilhaBackEndJR-JUN15.git
```

2. Navegue até o diretório do projeto

```bash
cd diretório-em-que-o-repositório-foi-clonado
```

3. Instale as dependências

```bash
npm install
```

### Configuração

1. Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

   ```
   cp .env.example .env
   ```

2. Edite o arquivo `.env` para adicionar o seu `JWT_SECRET`:

   ```
   JWT_SECRET=sua-chave-secreta-jwt
   ```

### Execução

- Para iniciar o servidor em modo de desenvolvimento, use o comando:

```
npm run dev
```

Isso iniciará o servidor em modo de escuta. Você pode acessar o projeto em `http://localhost:3000`.

- Se preferir executar o projeto em produção, utilize:

```
npm start
```

### Scripts disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm start`: Inicia o servidor em modo de produção.

### Endpoints disponíveis

| Método   | Endpoint         | Descrição                |
| -------- | ---------------- | ------------------------ |
| `POST`   | `/auth/register` | Registra um novo usuário |
| `POST`   | `/auth/login`    | Realiza login            |
| `GET`    | `/tasks`         | Lista todas as tarefas   |
| `POST`   | `/tasks`         | Cria uma nova tarefa     |
| `PATCH`  | `/tasks/:taskId` | Atualiza uma tarefa      |
| `DELETE` | `/tasks/:taskId` | Deleta uma tarefa        |
