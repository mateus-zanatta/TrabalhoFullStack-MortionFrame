# Publicando a Pokédex na Vercel (passo a passo)

Este guia coloca o projeto na internet para vocês apresentarem pelo navegador, sem precisar rodar nada no computador da sala.

## Antes de começar: entendendo as peças

No computador, o projeto tem 3 partes rodando ao mesmo tempo:

| Parte | No seu computador | Na internet (o que vamos usar) |
|---|---|---|
| Banco de dados | PostgreSQL instalado no PC | **Neon**: um PostgreSQL na nuvem, gratuito, criado pela própria Vercel |
| Back-end (API) | `npm run dev` na porta 3000 | **Projeto 1 na Vercel**, pasta `framer-motion/back` |
| Front-end (site) | `npm run dev` na porta 5173 | **Projeto 2 na Vercel**, pasta `framer-motion/front` |

Alguns conceitos que aparecem no caminho:

- **Deploy**: publicar o projeto em um servidor na internet.
- **Vercel**: serviço que pega o código direto do GitHub, faz o build e publica. O front vira um site normal. O back vira uma **função** (*serverless*): a Vercel "liga" o Express quando chega uma requisição, então vocês não precisam de um servidor ligado 24h.
- **Por que um banco na nuvem?** A Vercel não consegue acessar o PostgreSQL do seu computador, que só existe aí dentro.
- **Variáveis de ambiente**: são o `.env` da nuvem. Como o `.env` não vai para o GitHub (ele fica no `.gitignore`), os valores precisam ser cadastrados no painel da Vercel.
- **Dois projetos do mesmo repositório**: a Vercel deixa escolher qual pasta do repositório cada projeto usa (*Root Directory*).

> Ordem importante: **back-end → banco → tabelas e dados → front-end**. O front precisa saber o endereço do back antes de ser publicado.

---

## Passo 0 — Criar a conta

1. Acesse **vercel.com** → **Sign Up** → escolha o plano **Hobby** (gratuito).
2. Entre com o **GitHub** (*Continue with GitHub*). Assim a Vercel já enxerga os repositórios.

## Passo 1 — Publicar o back-end

1. No painel da Vercel: **Add New…** → **Project**.
2. Em *Import Git Repository*, encontre **TrabalhoFullStack-MortionFrames** e clique em **Import**.
   - Se o repositório não aparecer, clique em **Adjust GitHub App Permissions** e libere o acesso a ele.
3. Preencha a tela de configuração:
   - **Project Name**: `pokedex-back`. Esse nome vira o endereço, por exemplo `https://pokedex-back.vercel.app`; se o nome já existir, a Vercel coloca um sufixo.
   - **Root Directory**: clique em **Edit** e escolha `framer-motion/back`.
   - **Framework Preset**: deve aparecer **Express** sozinho. Não precisa mexer em *Build Command* nem em *Output Directory*.
4. Clique em **Deploy** e espere terminar (cerca de 1 minuto).
5. Abra o endereço do projeto. A página principal deve mostrar:
   `API: Pokédex - Exemplo de React Animations (Framer Motion)`

   A rota `/pokemons` ainda vai dar erro, porque falta o banco. Isso é esperado.

## Passo 2 — Criar o banco de dados (Neon)

1. Dentro do projeto **pokedex-back**, abra a aba **Storage**.
2. Clique em **Create Database** e escolha **Neon** (*Serverless Postgres*) → **Continue**.
3. Configure:
   - **Region**: escolha **US East (Washington / N. Virginia)**. É a mesma região onde a Vercel roda as funções por padrão, então a API e o banco ficam "perto" um do outro.
     - Se o banco foi criado em **São Paulo** (`sa-east-1` na URL), tudo bem: no projeto `pokedex-back`, vá em **Settings → Functions → Function Region**, escolha **São Paulo, Brazil (gru1)** e faça um **Redeploy**. Assim a API roda perto do banco e as respostas ficam mais rápidas.
   - **Plan**: **Free**.
   - **Name**: `pokedex-db`.
4. Clique para criar e, em seguida, em **Connect Project**: selecione o projeto `pokedex-back` e todos os ambientes (Production, Preview, Development). Se a tela pedir um **prefixo** para as variáveis, deixe em branco.
5. Confira em **Settings → Environment Variables** do `pokedex-back` se existe a variável **`DATABASE_URL`**. É ela que o nosso código usa.
   - Se ela não aparecer com esse nome exato, clique em **Add**, crie `DATABASE_URL` e cole como valor a *connection string* do banco (que começa com `postgresql://`).

> **Plano B:** se essa tela estiver diferente, crie a conta direto em **neon.tech**, crie um projeto, copie a *connection string* e cadastre a variável `DATABASE_URL` no `pokedex-back` como no item 5.

## Passo 3 — Criar as tabelas e cadastrar os Pokémon

O banco da nuvem nasce vazio. Vamos usar os mesmos comandos do Prisma da aula, rodando **do seu computador** e apontando para o banco da nuvem.

1. Copie a *connection string* do Neon. Ela fica em **Storage → pokedex-db**, na parte de conexão (aba `.env.local` ou botão **Show secret**). Prefira a **`DATABASE_URL_UNPOOLED`** se ela existir: é a conexão direta, recomendada para criar tabelas.
2. No arquivo `framer-motion/back/.env` do seu computador, troque o valor:

   ```
   # DATABASE_URL="postgresql://postgres:1234@localhost:5432/pokedex_framer?schema=public"
   DATABASE_URL="postgresql://...cole aqui a URL do Neon..."
   ```

3. No terminal, dentro de `framer-motion/back`:

   ```bash
   npx prisma migrate deploy
   ```

   Esse comando cria as tabelas usando a *migration* que já está no projeto. Na nuvem usamos o `migrate deploy` em vez do `migrate dev`: ele só aplica as migrations que já existem e não cria novas.

   ```bash
   npx prisma db seed
   ```

   Esse cadastra os 17 tipos e os 151 Pokémon. Deve aparecer `151 Pokémon Cadastrados...`.

4. Depois, se quiser, volte o `.env` para o banco local (é só tirar o `#` da linha antiga e comentar a nova).

## Passo 4 — Atualizar o back-end

Variáveis de ambiente só valem para **deploys novos**. Como a `DATABASE_URL` foi criada depois do primeiro deploy, é preciso publicar de novo:

1. No projeto **pokedex-back**, abra a aba **Deployments**.
2. No deploy mais recente, clique em **⋯** → **Redeploy** → **Redeploy**.
3. Teste no navegador: `https://SEU-BACK.vercel.app/pokemons` deve mostrar a lista em JSON.
4. **Anote esse endereço**, sem a barra no final. Ele será usado no front.

## Passo 5 — Publicar o front-end

1. No painel da Vercel: **Add New…** → **Project** → importe **o mesmo repositório** de novo.
2. Configure:
   - **Project Name**: `pokedex-motion`. Esse será o endereço que vocês vão abrir na apresentação.
   - **Root Directory**: **Edit** → `framer-motion/front`.
   - **Framework Preset**: deve aparecer **Vite** sozinho.
3. Abra **Environment Variables** (ainda nessa tela, **antes** do Deploy) e adicione:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://SEU-BACK.vercel.app` (o endereço do passo 4, **sem** `/` no final) |

   **Por que antes?** O Vite "cola" o valor de `VITE_API_URL` dentro do código na hora do build. Se a variável for criada ou alterada depois, é preciso fazer **Redeploy** do front.
4. Clique em **Deploy**.
5. Abra o endereço do `pokedex-motion` e teste:
   - a Pokédex carrega os 151 Pokémon;
   - abrir direto um endereço como `/detalhes/25` funciona;
   - o **Quem é esse Pokémon?** sorteia Pokémon.

Pronto! 🎉

---

## E quando o código mudar?

A cada `git push` no GitHub, a Vercel faz o deploy dos dois projetos sozinha.

A Vercel publica em produção a branch principal do repositório (hoje é a `claude/happy-ramanujan-swn382`). Se um dia vocês criarem uma `main` e passarem a usar ela, ajustem em **Settings → Git → Production Branch** dos dois projetos.

## Problemas comuns

| O que aparece | Causa provável | Como resolver |
|---|---|---|
| No site: *"Não foi possível conectar à API"* | `VITE_API_URL` errada ou vazia no front | Corrija em **Settings → Environment Variables** do `pokedex-motion` e faça **Redeploy** |
| `/pokemons` do back mostra `{"erro": ...}` com `P1001` ou similar | Back sem a `DATABASE_URL` (ou sem redeploy depois de criá-la) | Confira a variável e faça **Redeploy** do back |
| `/pokemons` mostra `[]` (lista vazia) | O seed não foi rodado no banco da nuvem | Refaça o **Passo 3** |
| `404: NOT_FOUND` no endereço do back ou do front | **Root Directory** errado | **Settings → Build and Deployment → Root Directory** e Redeploy |
| A primeira abertura demora alguns segundos | O banco gratuito do Neon "dorme" quando ninguém usa e leva um instante para acordar | Abram o site alguns minutos antes de apresentar |
| Pede login da Vercel ao abrir o link | Vocês abriram o link de um deploy específico (*preview*) | Usem o endereço de produção que aparece em **Domains** no projeto |

## O que mudou no código para rodar na Vercel

Se o professor perguntar, estas são as diferenças em relação a rodar só no computador:

1. **`back/src/server.ts`**: o `app.listen` só roda quando **não** estamos na Vercel (`process.env.VERCEL`), e o app é exportado com `export default app`. Na Vercel, é ela quem recebe as requisições e entrega para o Express.
2. **Imports com `.js`** (`./routes/pokemons.js`): o projeto usa ES Modules (`"type": "module"`). A Vercel converte cada arquivo TypeScript para JavaScript, e o Node só encontra os arquivos convertidos se o import tiver a extensão. No computador, o `tsx` entende que `pokemons.js` aponta para `pokemons.ts`.
3. **`back/prisma/schema.prisma`**: `importFileExtension = "js"` faz o Prisma gerar o client também com imports `.js`, pelo mesmo motivo.
4. **`back/prisma.config.ts`**: usa `process.env["DATABASE_URL"]` (como no projeto `login-social` do professor), para o build não falhar se a variável ainda não existir.
5. **`front/vercel.json`**: manda todos os endereços para o `index.html`. Sem isso, abrir direto `/detalhes/25` daria 404, porque quem conhece essa rota é o React Router, e não a Vercel.

## Dica para o dia da apresentação

- Abram o site de produção **antes** da aula começar: isso acorda o banco e a função.
- Tenham o projeto também rodando no computador (como no README) como **plano B**, caso a internet da sala falhe.
