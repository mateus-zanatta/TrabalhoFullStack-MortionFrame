import type { PokemonType } from "./utils/PokemonType"
import { useEffect, useState } from "react"
import { AnimatePresence, motion, useAnimate, type Variants } from "framer-motion"
import { toast } from "sonner"
import { Carregando } from "./components/Pokebola"
import { BadgeTipo } from "./components/BadgeTipo"

const apiUrl = import.meta.env.VITE_API_URL

type SorteioType = {
  pokemon: PokemonType
  opcoes: string[]
}

// botões de resposta entram em cascata (stagger)
const variantesOpcoes: Variants = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
}

const variantesBotao: Variants = {
  oculto: { opacity: 0, y: 20 },
  visivel: { opacity: 1, y: 0 },
}

export default function Quiz() {
  const [sorteio, setSorteio] = useState<SorteioType>()
  const [resposta, setResposta] = useState<string | null>(null)
  const [acertos, setAcertos] = useState(0)
  const [rodadas, setRodadas] = useState(0)

  // ===================================================================
  // FRAMER MOTION - Conceito: useAnimate (animação "imperativa")
  // -------------------------------------------------------------------
  // Até aqui as animações eram "declarativas" (props no JSX). Com o
  // useAnimate disparamos uma animação por CÓDIGO, dentro de uma função
  // - aqui, quando o jogador acerta (pulo) ou erra (tremida).
  // "scope" é a ref do elemento que será animado.
  // ===================================================================
  const [scope, animate] = useAnimate()

  async function sorteiaPokemon() {
    const response = await fetch(`${apiUrl}/pokemons/sorteio`)
    const dados = await response.json()
    setResposta(null)
    setSorteio(dados)
  }

  useEffect(() => {
    sorteiaPokemon()
  }, [])

  function responde(opcao: string) {
    if (resposta || !sorteio) return

    setResposta(opcao)
    setRodadas(rodadas + 1)

    if (opcao == sorteio.pokemon.nome) {
      setAcertos(acertos + 1)
      toast.success(`Isso aí! É o ${sorteio.pokemon.nome}!`)
      animate(scope.current, { scale: [1, 1.15, 1], y: [0, -30, 0] }, { duration: 0.5 })
    } else {
      toast.error(`Errou! Era o ${sorteio.pokemon.nome}...`)
      animate(scope.current, { x: [0, -25, 25, -15, 15, 0] }, { duration: 0.5 })
    }
  }

  // cor do botão depois de responder
  function estiloOpcao(opcao: string) {
    if (!resposta) return "bg-white text-gray-800 hover:bg-yellow-100"
    if (opcao == sorteio?.pokemon.nome) return "bg-green-500 text-white"
    if (opcao == resposta) return "bg-red-500 text-white"
    return "bg-white/60 text-gray-400"
  }

  if (!sorteio) {
    return <Carregando texto="Sorteando um Pokémon..." />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <h1 className="mt-8 text-center font-pixel text-xl md:text-3xl text-yellow-400 [-webkit-text-stroke:2px_#1d4ed8] leading-relaxed">
        Quem é esse Pokémon?
      </h1>

      <p className="text-center mt-2 font-semibold text-gray-600">
        Acertos: <b className="text-green-600">{acertos}</b> de {rodadas}
      </p>

      <div className="relative mt-6 h-80 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center bg-blue-500">
        {/* raios girando ao fundo (loop infinito) */}
        <motion.div
          className="absolute w-[200%] aspect-square"
          style={{ background: "repeating-conic-gradient(#3b82f6 0deg 10deg, #60a5fa 10deg 20deg)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />

        {/* "scope" do useAnimate: é esta div que pula/treme */}
        <div ref={scope} className="relative">
          <motion.img
            key={sorteio.pokemon.id}
            src={sorteio.pokemon.imagem}
            alt="Pokémon misterioso"
            draggable={false}
            initial={{ scale: 0, rotate: -180 }}
            // filter: "brightness(0)" deixa a imagem preta (silhueta)
            // ao responder, anima para "brightness(1)" e revela o Pokémon
            animate={{ scale: 1, rotate: 0, filter: resposta ? "brightness(1)" : "brightness(0)" }}
            transition={{ type: "spring", stiffness: 120, damping: 12, filter: { duration: 0.8 } }}
            className="w-64 h-64 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      <motion.div
        key={sorteio.pokemon.id}
        variants={variantesOpcoes}
        initial="oculto"
        animate="visivel"
        className="grid grid-cols-2 gap-3 mt-6"
      >
        {sorteio.opcoes.map(opcao => (
          <motion.button
            key={opcao}
            variants={variantesBotao}
            whileHover={!resposta ? { scale: 1.05 } : undefined}
            whileTap={!resposta ? { scale: 0.95 } : undefined}
            onClick={() => responde(opcao)}
            className={`py-4 rounded-xl font-bold text-lg shadow-md transition-colors cursor-pointer ${estiloOpcao(opcao)}`}
          >
            {opcao}
          </motion.button>
        ))}
      </motion.div>

      {/* o botão "Próximo" só aparece depois de responder (com animação de entrada e saída) */}
      <AnimatePresence>
        {resposta && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center gap-3 mt-6"
          >
            <div className="flex gap-2">
              {sorteio.pokemon.tipos.map(tipo => <BadgeTipo key={tipo.id} tipo={tipo} />)}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={sorteiaPokemon}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full shadow-lg cursor-pointer"
            >
              Próximo Pokémon →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
