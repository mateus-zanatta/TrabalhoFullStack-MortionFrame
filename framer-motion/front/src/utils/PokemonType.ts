import type { TipoType } from "./TipoType"

export type PokemonType = {
    id: number
    nome: string
    categoria: string
    descricao: string
    altura: number
    peso: number
    imagem: string
    imagemShiny: string
    sprite: string
    hp: number
    ataque: number
    defesa: number
    ataqueEspecial: number
    defesaEspecial: number
    velocidade: number
    lendario: boolean
    tipos: TipoType[]
}
