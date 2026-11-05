# React Animations com Framer Motion — Pokédex Motion

**Centro Universitário UniSenac – Campus Pelotas**
Programação Full Stack – Prof. Edécio Fernando Iepsen
Trabalho #2 – Pacotes Extras · Tecnologia: **6. React Animations (Framer Motion)**

Integrantes: Mateus Zanatta e _[nome da dupla]_

![Pokédex Motion](apresentacao/prints/pokedex.jpg)

---

## O que tem neste repositório

| Pasta / arquivo | O que é |
|---|---|
| `apresentacao/Apresentacao-Framer-Motion.pptx` | Apresentação para a turma (abre no PowerPoint, Google Slides ou dá para importar no Canva). 22 slides: conceitos do Framer Motion, explicação do projeto (estrutura de pastas e caminho dos dados), **onde está cada animação no site** (prints com marcações numeradas), código das animações, como rodar e roteiro da demonstração. Cada slide tem **notas do apresentador** com o que falar. |
| `framer-motion/back` | API em **Express + Prisma + PostgreSQL + Zod** (mesma estrutura dos exemplos da aula). |
| `framer-motion/front` | App em **React + Vite + Tailwind + React Router + React Hook Form + Sonner** e o pacote do trabalho: **Framer Motion**. |

A estrutura segue a do repositório de exemplos do professor (`trabalhos-exemplos-do-professor`): uma pasta por tecnologia, com `back/` e `front/` dentro.

---

## O que é o Framer Motion?

É uma biblioteca de animações para React. Em vez de escrever CSS com `@keyframes` e `transition`, você **descreve o estado** em que o elemento deve ficar e a biblioteca calcula a animação.

- **Declarativo**: você diz onde o elemento começa (`initial`) e onde termina (`animate`).
- **Física**: animações do tipo `spring` (mola) deixam o movimento mais natural.
- **Gestos**: hover, clique e arrastar (`whileHover`, `whileTap`, `drag`).
- **Saída de elementos**: com o `AnimatePresence` dá para animar algo que vai **sumir** da tela (algo bem difícil só com CSS).

> Observação: o projeto foi renomeado para **Motion** (pacote `motion`, importando de `"motion/react"`). O pacote `framer-motion` continua sendo publicado e a API é a mesma — usamos ele porque é o nome pedido no trabalho.

### Instalação

```bash
npm install framer-motion
```

### Primeiro exemplo

```tsx
import { motion } from "framer-motion"

export function Caixa() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}   // como começa
      animate={{ opacity: 1, y: 0 }}    // como termina
      transition={{ duration: 0.5 }}    // como vai de um ao outro
    />
  )
}
```

`motion.div`, `motion.img`, `motion.button`... existe uma versão "animável" de cada tag HTML. Ela aceita as mesmas props da tag normal (`className`, `onClick`, etc.) **mais** as props de animação.

---

## Onde está cada animação no projeto

Todos os arquivos ficam em `framer-motion/front/src`. Cada um tem um comentário `FRAMER MOTION - Conceito: ...` explicando o que foi usado.

| Arquivo | Onde aparece | Recursos do Framer Motion |
|---|---|---|
| `components/CardPokemon.tsx` | Cards da Pokédex | `variants` (com propagação para os filhos), `whileHover`, `whileTap`, `whileInView`, `layout`, `exit` |
| `components/FiltroTipos.tsx` | Botões de tipo (Fogo, Água...) | `layoutId` — o fundo colorido "desliza" até o botão clicado |
| `App.tsx` | Grid de cards | `AnimatePresence mode="popLayout"` — cards saem e os outros se reorganizam |
| `components/BarraStatus.tsx` | Página de detalhes | `staggerChildren` (cascata), variante como função + `custom`, `spring` |
| `components/Pokebola.tsx` | "Carregando..." e logo | keyframes (array de valores) + `repeat: Infinity` |
| `components/ImagemPokemon.tsx` | Página de detalhes | `drag`, `dragConstraints`, `dragSnapToOrigin`, `whileDrag`, `AnimatePresence mode="wait"` (troca normal/shiny) |
| `Quiz.tsx` | "Quem é esse Pokémon?" | `useAnimate` (animação disparada por código) e animação de `filter` |
| `components/TransicaoPagina.tsx` | Troca de páginas | `AnimatePresence` + `key` com o endereço da rota |
| `components/BarraProgresso.tsx` | Barra amarela no topo | `useScroll`, `useSpring`, `useTransform` (Motion Values) |

### Os 4 componentes principais (para explicar na apresentação)

**1. CardPokemon — variants e gestos**

```tsx
const variantesCard = {
  oculto:  { opacity: 0, y: 40, scale: 0.8 },
  visivel: { opacity: 1, y: 0, scale: 1 },
  saindo:  { opacity: 0, scale: 0.5 },
  hover:   { y: -10 },
}

<motion.div
  variants={variantesCard}
  initial="oculto"
  whileInView="visivel"   // anima quando o card aparece na tela ao rolar
  whileHover="hover"
  whileTap={{ scale: 0.95 }}
  exit="saindo"
  layout                  // anima a mudança de posição no grid
>
```

As *variants* são estados com nome. A imagem e a Pokébola do fundo também têm uma variante chamada `hover`; por isso, quando o mouse entra no card, **os filhos animam juntos** sem nenhum código extra (propagação).

**2. FiltroTipos — layoutId (shared layout)**

```tsx
{ativo && (
  <motion.span layoutId="tipo-ativo" className="absolute inset-0 rounded-full" />
)}
```

Só o botão ativo desenha o fundo. Como todos usam o **mesmo `layoutId`**, o Framer Motion entende que é o mesmo elemento mudando de lugar e faz ele deslizar até o novo botão.

**3. BarraStatus — stagger + spring**

```tsx
const variantesLista = { visivel: { transition: { staggerChildren: 0.12 } } }

const variantesBarra = {
  oculto: { width: 0 },
  visivel: (valor) => ({ width: `${valor / 200 * 100}%`, transition: { type: "spring" } }),
}

<motion.div custom={valor} variants={variantesBarra} />
```

O pai atrasa cada filho em 0,12s (efeito cascata). A variante da barra é uma **função** que recebe o valor pela prop `custom`.

**4. Pokebola e ImagemPokemon — loop e drag**

```tsx
// loop: array de valores = keyframes
<motion.svg animate={{ rotate: [0, -25, 25, -15, 15, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 0.5 }} />

// arrastar: ao soltar, volta ao lugar
<motion.img drag dragConstraints={areaRef} dragSnapToOrigin whileDrag={{ scale: 1.15 }} />
```

![Página de detalhes](apresentacao/prints/detalhes.jpg)

---

## Como rodar o projeto

**Pré-requisitos:** Node.js e PostgreSQL instalados.

### 1. Back-end (porta 3000)

```bash
cd framer-motion/back
```

Crie o arquivo `.env` copiando o `.env.example` e ajuste o usuário, a senha e o nome do banco:

```
DATABASE_URL="postgresql://postgres:1234@localhost:5432/pokedex_framer?schema=public"
```

```bash
npm install
```

O `npm install` já roda o `prisma generate` (script `postinstall`).

```bash
npx prisma migrate dev
```

Cria as tabelas `tipos` e `pokemons` (e a tabela de ligação N:N).

```bash
npx prisma db seed
```

Cadastra os 17 tipos e os 151 Pokémon (dados em `prisma/dados.ts`).

```bash
npm run dev
```

### 2. Front-end (porta 5173)

```bash
cd framer-motion/front
```

Crie o arquivo `.env` copiando o `.env.example` (ele guarda o endereço da API):

```
VITE_API_URL=http://localhost:3000
```

```bash
npm install
```

```bash
npm run dev
```

Abra `http://localhost:5173`.

### 3. Publicar na internet (Vercel)

Para apresentar pelo navegador sem rodar nada no computador da sala, siga o passo a passo em [`DEPLOY-VERCEL.md`](DEPLOY-VERCEL.md). Ele cobre o banco PostgreSQL na nuvem (Neon), o back-end e o front-end.

### Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pokemons` | Lista os 151 Pokémon com seus tipos |
| GET | `/pokemons/:id` | Um Pokémon pelo número da Pokédex |
| GET | `/pokemons/pesquisa/:termo` | Pesquisa por nome (ou parte), número ou tipo |
| GET | `/pokemons/sorteio` | Sorteia um Pokémon + 4 opções (jogo "Quem é esse Pokémon?") |
| POST | `/pokemons` | Cadastra um Pokémon (validação com Zod) |
| GET | `/tipos` | Lista os tipos com a quantidade de Pokémon de cada um |

---

## Roteiro sugerido para a demonstração

1. **Pokédex**: rolar a página — os cards aparecem conforme entram na tela (`whileInView`) e a barra amarela do topo mostra o progresso (`useScroll`).
2. **Filtro por tipo**: clicar em Fogo, Água, Planta... — o fundo do botão desliza (`layoutId`) e os cards saem e se reorganizam (`AnimatePresence` + `layout`).
3. **Hover nos cards**: o card sobe, a imagem balança e a Pokébola do fundo gira (`variants`).
4. **Detalhes**: as barras de status crescem em cascata (`stagger`), arrastar o Pokémon (`drag`), clicar em "Ver shiny" (`AnimatePresence`), ir para o próximo Pokémon (transição de página).
5. **Quem é esse Pokémon?**: errar (a imagem treme) e acertar (a imagem pula) — `useAnimate`.

![Quem é esse Pokémon?](apresentacao/prints/quiz.jpg)

---

## Créditos

- Dados e imagens dos Pokémon: [PokeAPI](https://pokeapi.co) e o repositório [PokeAPI/sprites](https://github.com/PokeAPI/sprites). As descrições foram traduzidas para o português.
- Documentação do Framer Motion / Motion: [motion.dev](https://motion.dev)
- Pokémon e seus nomes são marcas da Nintendo / Game Freak / The Pokémon Company. Projeto apenas acadêmico, sem fins comerciais.
