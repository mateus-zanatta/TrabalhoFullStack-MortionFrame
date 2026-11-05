import { motion } from "framer-motion"

type PokebolaProps = {
    tamanho?: number
    animada?: boolean
}

// =====================================================================
// FRAMER MOTION - Conceito: KEYFRAMES + REPEAT (animação em loop)
// ---------------------------------------------------------------------
// Quando passamos um ARRAY de valores no "animate", o Framer Motion
// percorre cada valor em sequência (keyframes). Com "repeat: Infinity"
// a animação fica em loop - igual à Pokébola balançando na captura!
// =====================================================================
export function Pokebola({ tamanho = 64, animada = false }: PokebolaProps) {
    return (
        <motion.svg
            viewBox="0 0 100 100"
            width={tamanho}
            height={tamanho}
            animate={animada ? { rotate: [0, -25, 25, -15, 15, 0] } : undefined}
            transition={animada ? {
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,     // repete para sempre
                repeatDelay: 0.5,     // pausa entre uma repetição e outra
            } : undefined}
        >
            <path d="M5 50 A45 45 0 0 1 95 50 Z" fill="#ef4444" />
            <path d="M5 50 A45 45 0 0 0 95 50 Z" fill="#ffffff" />
            <rect x="5" y="46" width="90" height="8" fill="#1f2937" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="6" />
            <circle cx="50" cy="50" r="14" fill="#ffffff" stroke="#1f2937" strokeWidth="6" />
            {/* o botão do centro "pisca" enquanto a Pokébola balança */}
            <motion.circle
                cx="50" cy="50" r="6" stroke="#1f2937" strokeWidth="2"
                initial={{ fill: "#ffffff" }}
                animate={animada ? { fill: ["#ffffff", "#fde047", "#ffffff"] } : undefined}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
            />
        </motion.svg>
    )
}

// Indicador de "carregando" usado enquanto os dados vêm da API
export function Carregando({ texto = "Carregando..." }: { texto?: string }) {
    return (
        <div className="flex flex-col items-center gap-4 py-20">
            <Pokebola tamanho={90} animada />
            <p className="font-pixel text-xs text-gray-500">{texto}</p>
        </div>
    )
}
