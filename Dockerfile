FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia todos os arquivos do projeto
COPY . .

# Instala dependências do projeto
RUN npm install

# Gera o build do PWA
RUN npm run build:pwa

# Instala um servidor estático simples globalmente
RUN npm install -g serve

# Expondo a porta (pode ser qualquer uma, ex.: 3000)
EXPOSE 80

# Comando para servir o build
CMD ["serve", "-s", "dist/pwa", "-l", "80"]
