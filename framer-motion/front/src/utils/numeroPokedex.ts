// Formata o número da Pokédex com 3 dígitos. Ex: 25 => "#025"
export function numeroPokedex(id: number) {
    return "#" + String(id).padStart(3, "0")
}
