-- CreateTable
CREATE TABLE "tipos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(20) NOT NULL,
    "cor" VARCHAR(7) NOT NULL,

    CONSTRAINT "tipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pokemons" (
    "id" INTEGER NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "categoria" VARCHAR(30) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "altura" DECIMAL(4,1) NOT NULL,
    "peso" DECIMAL(5,1) NOT NULL,
    "imagem" TEXT NOT NULL,
    "imagemShiny" TEXT NOT NULL,
    "sprite" TEXT NOT NULL,
    "hp" SMALLINT NOT NULL,
    "ataque" SMALLINT NOT NULL,
    "defesa" SMALLINT NOT NULL,
    "ataqueEspecial" SMALLINT NOT NULL,
    "defesaEspecial" SMALLINT NOT NULL,
    "velocidade" SMALLINT NOT NULL,
    "lendario" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PokemonToTipo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PokemonToTipo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipos_nome_key" ON "tipos"("nome");

-- CreateIndex
CREATE INDEX "_PokemonToTipo_B_index" ON "_PokemonToTipo"("B");

-- AddForeignKey
ALTER TABLE "_PokemonToTipo" ADD CONSTRAINT "_PokemonToTipo_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToTipo" ADD CONSTRAINT "_PokemonToTipo_B_fkey" FOREIGN KEY ("B") REFERENCES "tipos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
