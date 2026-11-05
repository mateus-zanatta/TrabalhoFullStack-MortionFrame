import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { PokemonType } from "../utils/PokemonType"

// =====================================================================
// FRAMER MOTION - Conceito: DRAG (arrastar) + loop + troca com exit
// ---------------------------------------------------------------------
// 1) "drag" deixa o elemento ser arrastado com o mouse/dedo.
//    - dragConstraints: limita a área (a div de fundo)
//    - dragSnapToOrigin: ao soltar, volta para o lugar de origem
//    - whileDrag: estilo enquanto está sendo arrastado
// 2) A div em volta "flutua" para cima e para baixo em loop
//    (repeatType "mirror": vai e volta).
// 3) Botão Shiny: o AnimatePresence troca a imagem normal pela shiny
//    com um efeito de "virar a carta" (rotateY). A "key" diferente faz
//    o React entender que é outro elemento => roda o exit e o animate.
// =====================================================================
export function ImagemPokemon({ pokemon }: { pokemon: PokemonType }) {
    const [shiny, setShiny] = useState(false)
    const areaRef = useRef<HTMLDivElement>(null)

    const cor1 = pokemon.tipos[0]?.cor ?? "#94a3b8"
    const cor2 = pokemon.tipos[1]?.cor ?? cor1

    return (
        <div ref={areaRef}
            className="relative h-96 md:h-full min-h-96 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${cor1}, ${cor2})` }}>

            {/* círculo pontilhado girando atrás do Pokémon */}
            <motion.div
                className="absolute w-72 h-72 rounded-full border-[10px] border-dashed border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />

            {/* flutuando: sobe e desce para sempre */}
            <motion.div
                animate={{ y: [0, -15] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                style={{ perspective: 800 }}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={shiny ? "shiny" : "normal"}
                        src={shiny ? pokemon.imagemShiny : pokemon.imagem}
                        alt={pokemon.nome}
                        draggable={false}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        drag
                        dragConstraints={areaRef}
                        dragSnapToOrigin
                        dragElastic={0.4}
                        whileDrag={{ scale: 1.15 }}
                        className="relative w-64 h-64 object-contain drop-shadow-2xl cursor-grab active:cursor-grabbing"
                    />
                </AnimatePresence>
            </motion.div>

            <motion.button
                onClick={() => setShiny(!shiny)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-4 bg-white/90 text-gray-800 font-bold text-sm px-4 py-2 rounded-full shadow cursor-pointer"
            >
                {shiny ? "Ver normal" : "✨ Ver shiny"}
            </motion.button>

            <p className="absolute bottom-3 text-xs font-semibold text-white/90">
                Arraste o Pokémon com o mouse!
            </p>
        </div>
    )
}
