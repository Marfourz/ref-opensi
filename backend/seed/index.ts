import { users } from './users';
import { organisations } from './organisations';
import { engines } from './engines';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.development' });
const { PrismaClient } = require('@prisma/client');
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  try {
    /*const newOrganisation = await prisma.organisation.create({
      data: organisations[0],
    });
    console.info('Organisation created : ', newOrganisation);

    const newEngine = await prisma.engine.create({
      data: engines[0],
    });
    console.info('ENGINE created : ', newEngine);*/

    axios
      .post(process.env.USERS_MANAGER_URL + '/users', {
        email: 'admin@admin.com',
        username: 'admin@admin.com',
        password: 'azertyuiop789',
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    /*const newUser = await prisma.user.createMany({
      data: users.map((value: any) => {
        return {
          ...value,
          organisationId: newOrganisation.id,
          engineId: newEngine.id,
        };
      }),
    });
    console.info('Users created : ', newUser);*/
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
