import { CardPokemon } from "./components/CardPokemon";
import { InputPesquisa } from "./components/InputPesquisa";
import { FiltroTipos } from "./components/FiltroTipos";
import { Carregando } from "./components/Pokebola";
import type { PokemonType } from "./utils/PokemonType";
import type { TipoType } from "./utils/TipoType";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const apiUrl = import.meta.env.VITE_API_URL

export default function App() {
  const [pokemons, setPokemons] = useState<PokemonType[]>([])
  const [tipos, setTipos] = useState<TipoType[]>([])
  const [tipoAtivo, setTipoAtivo] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscaDados() {
      try {
        const [respPokemons, respTipos] = await Promise.all([
          fetch(`${apiUrl}/pokemons`),
          fetch(`${apiUrl}/tipos`)
        ])
        setPokemons(await respPokemons.json())
        setTipos(await respTipos.json())
      } catch {
        toast.error("Não foi possível conectar à API. O back-end está rodando?")
      }
      setCarregando(false)
    }
    buscaDados()
  }, [])

  // filtra pelo tipo selecionado (no próprio front, para a animação ser instantânea)
  const pokemonsFiltrados = tipoAtivo
    ? pokemons.filter(pokemon => pokemon.tipos.some(tipo => tipo.id == tipoAtivo))
    : pokemons

  const listaPokemons = pokemonsFiltrados.map(pokemon => (
    <CardPokemon data={pokemon} key={pokemon.id} />
  ))

  return (
    <>
      <InputPesquisa setPokemons={setPokemons} />
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="mt-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl text-center">
          Pokédex de <span className="underline underline-offset-3 decoration-8 decoration-red-500">Kanto</span>
        </h1>

        <FiltroTipos tipos={tipos} tipoAtivo={tipoAtivo} setTipoAtivo={setTipoAtivo} />

        <p className="text-center text-sm text-gray-500 mb-4">
          Exibindo <b>{pokemonsFiltrados.length}</b> Pokémon
        </p>

        {carregando ? <Carregando texto="Procurando Pokémon..." /> : (
          // =============================================================
          // FRAMER MOTION - AnimatePresence mode="popLayout"
          // Ao filtrar, os cards que SAEM executam o "exit" e são
          // "retirados" do grid na hora; os que FICAM deslizam para a
          // nova posição graças ao prop "layout" do CardPokemon.
          // =============================================================
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
            <AnimatePresence mode="popLayout">
              {listaPokemons}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}
