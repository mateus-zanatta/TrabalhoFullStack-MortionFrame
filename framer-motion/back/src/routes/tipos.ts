import { prisma } from "../../lib/prisma.js"

import { Router } from 'express'

const router = Router()

// Lista os tipos (Fogo, Água, ...) com a quantidade de Pokémon de cada um
router.get("/", async (req, res) => {
  try {
    const tipos = await prisma.tipo.findMany({
      orderBy: { nome: "asc" },
      include: {
        _count: { select: { pokemons: true } }
      }
    })
    res.status(200).json(tipos)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

export default router
