import { motion, useScroll, useSpring, useTransform } from "framer-motion"

// =====================================================================
// FRAMER MOTION - Conceito: HOOKS useScroll + useSpring + useTransform
// ---------------------------------------------------------------------
// useScroll() devolve:
//   - scrollYProgress: valor de 0 a 1 (quanto da página já foi rolado)
//   - scrollY: quantos pixels já foram rolados
// useSpring() suaviza o valor com física de mola.
// useTransform() converte um valor em outro: aqui, de 0 a 80px de
// rolagem a opacidade vai de 0 a 1 (a barra só aparece ao rolar).
// Obs.: Motion Values atualizam a tela SEM re-renderizar o componente.
// =====================================================================
export default function BarraProgresso() {
    const { scrollY, scrollYProgress } = useScroll()

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 120,   // "força" da mola
        damping: 30,      // "amortecimento" (quanto maior, menos balança)
        restDelta: 0.001
    })

    const opacity = useTransform(scrollY, [0, 80], [0, 1])

    return (
        <motion.div
            style={{ scaleX, opacity }}
            className="fixed top-0 left-0 right-0 h-1.5 bg-yellow-400 origin-left z-50"
        />
    )
}
