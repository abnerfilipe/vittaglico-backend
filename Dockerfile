# --- Estágio de Build ---
# Use uma imagem base do Node.js 20
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Executa o build da aplicação
RUN npm run build

# --- Estágio de Produção ---
# Use uma imagem menor para produção
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia apenas os artefatos necessários do estágio de build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta que sua aplicação usa (geralmente 3000 para NestJS)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD [ "node", "dist/main" ]