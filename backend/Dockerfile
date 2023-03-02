FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "dist/apps/core/main"]

EXPOSE 3000
