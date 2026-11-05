import { prisma } from "../lib/prisma.js"
import { tipos, pokemons } from "./dados.js"

// Repositório público com os sprites dos Pokémon (usado pela PokeAPI)
const urlSprites = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

async function main() {
  try {

    // Cadastro dos tipos
    for (const [nome, cor] of tipos) {
      await prisma.tipo.upsert({
        where: { nome },
        update: { cor },
        create: { nome, cor }
      })
    }

    console.log(`${tipos.length} Tipos Cadastrados...`);

    // Cadastro dos Pokémon (com as URLs das imagens)
    for (const pokemon of pokemons) {
      const { tipos: nomesTipos, ...dados } = pokemon

      const imagens = {
        imagem: `${urlSprites}/other/official-artwork/${pokemon.id}.png`,
        imagemShiny: `${urlSprites}/other/official-artwork/shiny/${pokemon.id}.png`,
        sprite: `${urlSprites}/versions/generation-v/black-white/animated/${pokemon.id}.gif`,
      }

      await prisma.pokemon.upsert({
        where: { id: pokemon.id },
        update: {},
        create: {
          ...dados,
          ...imagens,
          tipos: {
            connect: nomesTipos.map(nome => ({ nome }))
          }
        }
      })
    }

    console.log(`${pokemons.length} Pokémon Cadastrados...`);

  } catch (error) {
    console.error("Erro nas Inclusões (Seeds):", error);
    throw error;

  } finally {
    await prisma.$disconnect();
  }
}

await main();
