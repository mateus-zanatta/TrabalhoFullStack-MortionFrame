import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { PokemonType } from "../utils/PokemonType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setPokemons: React.Dispatch<React.SetStateAction<PokemonType[]>>
}

export function InputPesquisa({ setPokemons }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        if (data.termo.length < 2 && isNaN(Number(data.termo))) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        const response = await fetch(`${apiUrl}/pokemons/pesquisa/${data.termo}`)
        const dados = await response.json()
        if (dados.length == 0) {
            toast.warning("Nenhum Pokémon encontrado...")
        }
        setPokemons(dados)
    }

    async function mostraTodos() {
        const response = await fetch(`${apiUrl}/pokemons`)
        const dados = await response.json()
        reset({ termo: "" })
        setPokemons(dados)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 mx-auto max-w-5xl mt-5 px-4">
            <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-xl bg-white focus:ring-red-500 focus:border-red-500"
                        placeholder="Informe nome, número ou tipo (ex: pikachu, 25, fogo)" required
                        {...register('termo')} />
                    {/* whileTap: o botão "afunda" ao ser clicado */}
                    <motion.button type="submit" whileTap={{ scale: 0.9 }}
                        className="text-white absolute end-2.5 bottom-2.5 bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2">
                        Pesquisar
                    </motion.button>
                </div>
            </form>
            <motion.button type="button" whileTap={{ scale: 0.9 }}
                className="text-white bg-slate-700 hover:bg-slate-800 font-medium rounded-xl text-sm px-5 py-3"
                onClick={mostraTodos}>
                Exibir Todos
            </motion.button>
        </div>
    )
}
