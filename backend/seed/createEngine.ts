const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const engines = [
  {
    name: 'Moto 2 roues',
    description: 'Engin motorisé avec 02 roues',
  },
  {
    name: 'Tricycle',
    description: 'Engin motorisé avec 03 roues',
  },
  {
    name: 'Voiture',
    description: 'Engin motorisé avec 04 roues',
  },
];

async function main() {
  try {
    const newEngine = await prisma.engine.createMany({
      data: engines,
    });
    console.info('Organisation created : ', newEngine);
  } catch (error) {
    throw error;
    return;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
