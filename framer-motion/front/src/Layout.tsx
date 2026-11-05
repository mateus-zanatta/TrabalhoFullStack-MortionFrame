import Titulo from './components/Titulo.tsx'
import BarraProgresso from './components/BarraProgresso.tsx'
import TransicaoPagina from './components/TransicaoPagina.tsx'

import { Toaster } from 'sonner'

export default function Layout() {
  return (
    <>
      <BarraProgresso />
      <Titulo />
      {/* no lugar do <Outlet />, um Outlet com animação de entrada e saída */}
      <TransicaoPagina />
      <Toaster richColors position="top-center" />
    </>
  )
}
