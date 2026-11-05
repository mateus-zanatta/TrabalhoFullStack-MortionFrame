import express from 'express'
import cors from 'cors'

// obs.: a extensão .js nos imports é necessária para rodar na Vercel (ES Modules).
// O tsx (npm run dev) entende que "./routes/pokemons.js" é o arquivo pokemons.ts
import routesPokemons from './routes/pokemons.js'
import routesTipos from './routes/tipos.js'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/pokemons", routesPokemons)
app.use("/tipos", routesTipos)

app.get('/', (req, res) => {
  res.send('API: Pokédex - Exemplo de React Animations (Framer Motion)')
})

// No computador, o próprio Express "liga" o servidor na porta 3000.
// Na Vercel (variável VERCEL definida), quem recebe as requisições é a
// Vercel: ela usa o app exportado abaixo (export default).
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
  })
}

export default app
