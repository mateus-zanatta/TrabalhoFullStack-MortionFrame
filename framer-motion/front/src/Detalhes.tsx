import type { PokemonType } from "./utils/PokemonType"
import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { numeroPokedex } from "./utils/numeroPokedex"
import { BadgeTipo } from "./components/BadgeTipo"
import { BarraStatus } from "./components/BarraStatus"
import { ImagemPokemon } from "./components/ImagemPokemon"
import { Carregando } from "./components/Pokebola"

const apiUrl = import.meta.env.VITE_API_URL

const TOTAL_POKEMONS = 151

export default function Detalhes() {
  const params = useParams()

  const [pokemon, setPokemon] = useState<PokemonType>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/pokemons/${params.pokemonId}`)
      const dados = await response.json()
      setPokemon(dados)
    }
    buscaDados()
  }, [params.pokemonId])

  if (!pokemon) {
    return <Carregando />
  }

  const anterior = pokemon.id > 1 ? pokemon.id - 1 : null
  const proximo = pokemon.id < TOTAL_POKEMONS ? pokemon.id + 1 : null

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">

      <div className="flex justify-between mt-6 mb-3">
        {anterior ?
          <Link to={`/detalhes/${anterior}`} className="font-bold text-gray-600 hover:text-red-600">
            ← {numeroPokedex(anterior)}
          </Link> : <span />}
        <Link to="/" className="font-bold text-gray-600 hover:text-red-600">
          Voltar à Pokédex
        </Link>
        {proximo ?
          <Link to={`/detalhes/${proximo}`} className="font-bold text-gray-600 hover:text-red-600">
            {numeroPokedex(proximo)} →
          </Link> : <span />}
      </div>

      <section className="bg-white rounded-2xl shadow-lg overflow-hidden md:grid md:grid-cols-2">

        <ImagemPokemon pokemon={pokemon} />

        <div className="p-6">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-lg font-bold text-gray-400">{numeroPokedex(pokemon.id)}</p>
              <h2 className="text-4xl font-extrabold text-gray-900">{pokemon.nome}</h2>
              <p className="text-gray-500 font-semibold">Pokémon {pokemon.categoria}</p>
            </div>
            {/* sprite animado (.gif) da geração 5 */}
            <img src={pokemon.sprite} alt={`Sprite de ${pokemon.nome}`}
              className="ms-auto h-20" style={{ imageRendering: "pixelated" }} />
          </div>

          <div className="flex gap-2 mt-3">
            {pokemon.tipos.map(tipo => (
              <BadgeTipo key={tipo.id} tipo={tipo} />
            ))}
            {pokemon.lendario &&
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-yellow-400 text-yellow-900">★ Lendário</span>}
          </div>

          <p className="mt-4 text-gray-700 italic">"{pokemon.descricao}"</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-100 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-gray-500">Altura</p>
              <p className="text-xl font-bold text-gray-800">
                {Number(pokemon.altura).toLocaleString("pt-br")} m
              </p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-slate-100 rounded-xl p-3 text-center">
              <p className="text-xs font-semibold text-gray-500">Peso</p>
              <p className="text-xl font-bold text-gray-800">
                {Number(pokemon.peso).toLocaleString("pt-br")} kg
              </p>
            </motion.div>
          </div>

          <h3 className="mt-6 mb-3 text-xl font-bold text-gray-900">Status base</h3>
          <BarraStatus pokemon={pokemon} />
        </div>
      </section>
    </div>
  )
}
