import { AnimatePresence, motion } from "framer-motion"
import { useLocation, useOutlet } from "react-router-dom"
import { useState } from "react"

// "Congela" o conteúdo da rota no momento em que a página foi montada.
// Sem isso, durante a animação de saída, a página antiga já mostraria
// o conteúdo da página nova.
function OutletCongelado() {
    const outlet = useOutlet()
    const [congelado] = useState(outlet)
    return congelado
}

// =====================================================================
// FRAMER MOTION - Conceito: AnimatePresence (animação de SAÍDA)
// ---------------------------------------------------------------------
// O React remove um componente da tela imediatamente. O AnimatePresence
// "segura" o componente até a animação do "exit" terminar.
// Usamos a "key" com o endereço (pathname): ao trocar de página a key
// muda, a página antiga executa o "exit" e a nova executa o "animate".
// mode="wait": espera a página antiga sair para a nova entrar.
// =====================================================================
export default function TransicaoPagina() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            <motion.main
                key={location.pathname}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
            >
                <OutletCongelado />
            </motion.main>
        </AnimatePresence>
    )
}
