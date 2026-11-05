import { motion, type Variants } from "framer-motion"
import type { PokemonType } from "../utils/PokemonType"

// =====================================================================
// FRAMER MOTION - Conceito: STAGGER (animação em cascata) + SPRING
// ---------------------------------------------------------------------
// A lista (pai) usa "staggerChildren": cada filho começa a animar um
// pouquinho depois do anterior, criando o efeito cascata.
// Cada barra usa uma variante em forma de FUNÇÃO, que recebe o valor
// pelo prop "custom" e calcula a largura final da barra.
// "type: spring" usa física de mola (a barra "passa" e volta).
// =====================================================================
const variantesLista: Variants = {
    oculto: {},
    visivel: {
        transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    },
}

const VALOR_MAXIMO = 200

const variantesBarra: Variants = {
    oculto: { width: 0 },
    visivel: (valor: number) => ({
        width: `${Math.min(valor / VALOR_MAXIMO, 1) * 100}%`,
        transition: { type: "spring", stiffness: 60, damping: 10 },
    }),
}

const variantesLinha: Variants = {
    oculto: { opacity: 0, x: -20 },
    visivel: { opacity: 1, x: 0 },
}

// cor da barra conforme o valor do atributo
function corDoValor(valor: number) {
    if (valor < 50) return "#ef4444"
    if (valor < 80) return "#f59e0b"
    if (valor < 110) return "#22c55e"
    return "#14b8a6"
}

export function BarraStatus({ pokemon }: { pokemon: PokemonType }) {
    const status = [
        { nome: "HP", valor: pokemon.hp },
        { nome: "Ataque", valor: pokemon.ataque },
        { nome: "Defesa", valor: pokemon.defesa },
        { nome: "Atq. Especial", valor: pokemon.ataqueEspecial },
        { nome: "Def. Especial", valor: pokemon.defesaEspecial },
        { nome: "Velocidade", valor: pokemon.velocidade },
    ]

    const total = status.reduce((soma, s) => soma + s.valor, 0)

    return (
        <motion.ul
            variants={variantesLista}
            initial="oculto"
            whileInView="visivel"
            viewport={{ once: true }}
            className="space-y-2.5"
        >
            {status.map(s => (
                <motion.li key={s.nome} variants={variantesLinha} className="flex items-center gap-3">
                    <span className="w-28 text-sm font-semibold text-gray-500">{s.nome}</span>
                    <span className="w-8 text-right font-bold text-gray-800">{s.valor}</span>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            custom={s.valor}
                            variants={variantesBarra}
                            className="h-full rounded-full"
                            style={{ backgroundColor: corDoValor(s.valor) }}
                        />
                    </div>
                </motion.li>
            ))}
            <motion.li variants={variantesLinha} className="flex items-center gap-3 pt-2 border-t border-gray-200">
                <span className="w-28 text-sm font-semibold text-gray-500">Total</span>
                <span className="w-8 text-right font-extrabold text-gray-900">{total}</span>
            </motion.li>
        </motion.ul>
    )
}
