import { motion } from "framer-motion"
import type { TipoType } from "../utils/TipoType"

type FiltroTiposProps = {
    tipos: TipoType[]
    tipoAtivo: number | null
    setTipoAtivo: (id: number | null) => void
}

// =====================================================================
// FRAMER MOTION - Conceito: SHARED LAYOUT (layoutId)
// ---------------------------------------------------------------------
// Só o botão ATIVO desenha o fundo colorido (<motion.span>). Como todos
// usam o MESMO layoutId ("tipo-ativo"), quando o fundo some de um botão
// e aparece em outro, o Framer Motion entende que é o "mesmo" elemento
// e faz ele DESLIZAR da posição antiga até a nova, sozinho!
// =====================================================================
export function FiltroTipos({ tipos, tipoAtivo, setTipoAtivo }: FiltroTiposProps) {
    const opcoes = [{ id: null, nome: "Todos", cor: "#334155" }, ...tipos]

    return (
        <div className="flex flex-wrap justify-center gap-2 my-6">
            {opcoes.map(tipo => {
                const ativo = tipo.id === tipoAtivo
                return (
                    <button
                        key={tipo.nome}
                        onClick={() => setTipoAtivo(tipo.id)}
                        className="relative px-3 py-1 rounded-full text-sm font-bold border-2 cursor-pointer"
                        style={{ borderColor: tipo.cor, backgroundColor: ativo ? "transparent" : "#ffffff" }}
                    >
                        {ativo && (
                            <motion.span
                                layoutId="tipo-ativo"
                                className="absolute -inset-0.5 rounded-full shadow-md"
                                style={{ backgroundColor: tipo.cor }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className={`relative z-10 ${ativo ? "text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.45)]" : "text-slate-700"}`}>
                            {tipo.nome}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
