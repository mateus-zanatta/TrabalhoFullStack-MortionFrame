import { prisma } from "../../lib/prisma.js"

import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const pokemonSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string().min(3,
    { message: "Nome deve possuir, no mínimo, 3 caracteres" }),
  categoria: z.string(),
  descricao: z.string().max(255),
  altura: z.number(),
  peso: z.number(),
  imagem: z.string().url(),
  imagemShiny: z.string().url(),
  sprite: z.string().url(),
  hp: z.number().int(),
  ataque: z.number().int(),
  defesa: z.number().int(),
  ataqueEspecial: z.number().int(),
  defesaEspecial: z.number().int(),
  velocidade: z.number().int(),
  lendario: z.boolean().optional(),
  tipos: z.array(z.number().int()).min(1).max(2,
    { message: "Um Pokémon possui 1 ou 2 tipos" }),
})

// Lista todos os Pokémon (em ordem de número da Pokédex)
router.get("/", async (req, res) => {
  try {
    const pokemons = await prisma.pokemon.findMany({
      orderBy: { id: "asc" },
      include: {
        tipos: true,
      }
    })
    res.status(200).json(pokemons)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Embaralha um array (algoritmo de Fisher-Yates)
function embaralha<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

// Sorteia um Pokémon e 4 opções de resposta (jogo "Quem é esse Pokémon?")
// obs.: deve ficar antes da rota "/:id"
router.get("/sorteio", async (req, res) => {
  try {
    const todos = await prisma.pokemon.findMany({
      select: { id: true, nome: true }
    })

    const sorteados = embaralha(todos).slice(0, 4)

    const pokemon = await prisma.pokemon.findUnique({
      where: { id: sorteados[0].id },
      include: { tipos: true }
    })

    const opcoes = embaralha(sorteados.map(p => p.nome))

    res.status(200).json({ pokemon, opcoes })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// Pesquisa por número, nome (ou parte dele) ou tipo
router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter para número
  const termoNumero = Number(termo)

  try {
    // is Not a Number, ou seja, se não é um número: filtra por texto
    if (isNaN(termoNumero)) {
      const pokemons = await prisma.pokemon.findMany({
        orderBy: { id: "asc" },
        include: {
          tipos: true,
        },
        where: {
          OR: [
            { nome: { contains: termo, mode: "insensitive" } },
            { tipos: { some: { nome: { equals: termo, mode: "insensitive" } } } }
          ]
        }
      })
      res.status(200).json(pokemons)
    } else {
      const pokemons = await prisma.pokemon.findMany({
        include: {
          tipos: true,
        },
        where: { id: termoNumero }
      })
      res.status(200).json(pokemons)
    }
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const pokemon = await prisma.pokemon.findUnique({
      where: { id: Number(id) },
      include: {
        tipos: true,
      }
    })

    if (!pokemon) {
      res.status(404).json({ erro: "Pokémon não encontrado" })
      return
    }

    res.status(200).json(pokemon)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {

  const valida = pokemonSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error.issues })
    return
  }

  const { tipos, ...dados } = valida.data

  try {
    const pokemon = await prisma.pokemon.create({
      data: {
        ...dados,
        tipos: {
          connect: tipos.map(id => ({ id }))
        }
      },
      include: { tipos: true }
    })
    res.status(201).json(pokemon)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
