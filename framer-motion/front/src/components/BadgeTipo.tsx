import type { TipoType } from "../utils/TipoType"

export function BadgeTipo({ tipo }: { tipo: TipoType }) {
    return (
        <span className="px-3 py-0.5 rounded-full text-xs font-bold text-white shadow-sm [text-shadow:0_1px_1px_rgb(0_0_0/0.4)]"
            style={{ backgroundColor: tipo.cor }}>
            {tipo.nome}
        </span>
    )
}
