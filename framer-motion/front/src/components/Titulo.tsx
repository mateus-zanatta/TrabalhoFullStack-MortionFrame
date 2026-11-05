import { Link, NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { Pokebola } from "./Pokebola"

export default function Titulo() {

    const estiloLink = ({ isActive }: { isActive: boolean }) =>
        `block py-2 px-3 rounded-lg font-semibold transition-colors ${isActive ? "bg-white text-red-600" : "text-white hover:bg-red-700"}`

    return (
        <nav className="bg-red-600 border-b-4 border-red-800 shadow-md">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between gap-3 mx-auto p-4">
                <Link to="/" className="flex items-center gap-3">
                    {/* gira 360 graus ao passar o mouse */}
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                        <Pokebola tamanho={44} />
                    </motion.div>
                    <span className="font-pixel text-white text-base md:text-xl drop-shadow">
                        Pokédex Motion
                    </span>
                </Link>
                <ul className="flex gap-2 text-sm md:text-base">
                    <li>
                        <NavLink to="/" end className={estiloLink}>
                            Pokédex
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/quiz" className={estiloLink}>
                            Quem é esse Pokémon?
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
