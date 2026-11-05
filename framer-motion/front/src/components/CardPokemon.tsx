import { Link } from "react-router-dom"
import { motion, type Variants } from "framer-motion"
import type { PokemonType } from "../utils/PokemonType"
import { numeroPokedex } from "../utils/numeroPokedex"
import { BadgeTipo } from "./BadgeTipo"
import { Pokebola } from "./Pokebola"

// =====================================================================
// FRAMER MOTION - Conceito: VARIANTS (estados com nome)
// ---------------------------------------------------------------------
// Em vez de escrever os valores direto no componente, criamos "estados"
// com nome (oculto, visivel, saindo, hover). O componente pai usa o
// NOME do estado e os FILHOS que tiverem uma variante com o mesmo nome
// também são animados (propagação). Assim, passar o mouse no card faz
// a imagem do Pokémon e a Pokébola do fundo se mexerem juntas!
// =====================================================================
const variantesCard: Variants = {
    oculto: { opacity: 0, y: 40, scale: 0.8 },
    visivel: { opacity: 1, y: 0, scale: 1 },
    saindo: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
    hover: { y: -10 },
}

const variantesImagem: Variants = {
    visivel: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.2,
        rotate: [0, -10, 10, -5, 0],   // keyframes: "balança" a imagem
        transition: { duration: 0.5 },
    },
}

const variantesPokebolaFundo: Variants = {
    visivel: { rotate: 0 },
    hover: { rotate: 180, transition: { duration: 0.6 } },
}

type CardPokemonProps = {
    data: PokemonType
    // ref é necessária para o <AnimatePresence mode="popLayout"> (no App.tsx)
    ref?: React.Ref<HTMLDivElement>
}

export function CardPokemon({ data, ref }: CardPokemonProps) {
    const cor1 = data.tipos[0]?.cor ?? "#94a3b8"
    const cor2 = data.tipos[1]?.cor ?? cor1

    return (
        <motion.div
            ref={ref}
            layout                         // anima a MUDANÇA DE POSIÇÃO no grid ao filtrar
            variants={variantesCard}
            initial="oculto"               // estado inicial
            whileInView="visivel"          // anima quando o card APARECE na tela (scroll)
            viewport={{ once: true, amount: 0.2 }}
            exit="saindo"                  // animação de saída (AnimatePresence)
            whileHover="hover"             // gesto: mouse em cima
            whileTap={{ scale: 0.95 }}     // gesto: clique
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden"
        >
            <Link to={`/detalhes/${data.id}`}>
                <div className="relative h-36 flex items-center justify-center overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${cor1}66, ${cor2}cc)` }}>
                    <motion.div variants={variantesPokebolaFundo}
                        className="absolute -right-8 -top-8 opacity-20">
                        <Pokebola tamanho={130} />
                    </motion.div>
                    <motion.img
                        variants={variantesImagem}
                        src={data.imagem}
                        alt={data.nome}
                        loading="lazy"
                        className="relative h-32 w-32 object-contain drop-shadow-lg"
                    />
                </div>
                <div className="p-4">
                    <p className="text-sm font-bold text-gray-400">{numeroPokedex(data.id)}</p>
                    <h3 className="text-lg font-bold text-gray-800">{data.nome}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {data.tipos.map(tipo => (
                            <BadgeTipo key={tipo.id} tipo={tipo} />
                        ))}
                    </div>
                </div>
            </Link>
            {data.lendario &&
                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                    ★ Lendário
                </span>
            }
        </motion.div>
    )
}
