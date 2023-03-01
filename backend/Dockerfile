FROM node:16.13.1

WORKDIR /app

COPY package*.json ./

COPY prisma/schema.prisma ./prisma/

COPY . .

RUN npm install

RUN npm run prebuild

RUN npx @nestjs/cli build

EXPOSE 3000

CMD ["node", "dist/app/core/src/main"]

