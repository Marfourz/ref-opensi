import { users } from './users';
import { organisations } from './organisations';
import { engines } from './engines';
const { PrismaClient } = require('@prisma/client');
import { AuthService } from 'apps/core/src/users-manager/auth.service';

const prisma = new PrismaClient();

async function main() {
  try {
    const newOrganisation = await prisma.organisation.create({
      data: organisations[0],
    });
    console.info('Organisation created : ', newOrganisation);

    const newEngine = await prisma.engine.create({
      data: engines[0],
    });
    console.info('ENGINE created : ', newEngine);

    const newUser = await prisma.user.createMany({
      data: users.map((value: any) => {
        return {
          ...value,
          organisationId: newOrganisation.id,
          engineId: newEngine.id,
        };
      }),
    });
    console.info('Users created : ', newUser);
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
