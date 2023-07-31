import { user, deliveryMan } from './users';
import { organisations } from './organisations';
import { engines } from './engines';
import { categories } from './p-categories';
import { products } from './products';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.development' });
// eslint-disable-next-line @typescript-eslint/no-var-requires
//
const { PrismaClient } = require('@prisma/client');
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  try {
    //get all users of user-managers and delete them
    const users = await (
      await axios.get(process.env.USERS_MANAGER_URL + '/users')
    ).data;

    for (let i = 0; i < users.length; i++) {
      const element = users[i];
      await axios.delete(
        process.env.USERS_MANAGER_URL + '/users/' + element.id,
      );
    }
    // create user for users-managers
    axios
      .post(process.env.USERS_MANAGER_URL + '/users', {
        email: 'admin@admin.com',
        username: 'admin@admin.com',
        password: 'azertyuiop789',
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log('Users manager respond: ' + error.response.statusText);
      });

    //create engines

    await prisma.engine.deleteMany({});
    await prisma.engine.createMany({
      data: engines,
    });

    // create organisation if not exist
    const organisation = organisations[0];

    let orgId = '';

    const existingOrganisation = await prisma.organisation.findUnique({
      where: {
        email: organisation.email,
      },
    });

    if (!existingOrganisation) {
      const newOrganisation = await prisma.organisation.create({
        data: organisation,
      });
      console.info('Organisation new created : ', newOrganisation);
      orgId = newOrganisation.id;
    } else {
      console.info('Organisation was already created : ', existingOrganisation);
      orgId = existingOrganisation.id;
    }

    //create corresponding wallet
    const existingWallet = await prisma.wallet.findUnique({
      where: {
        organisationId: orgId,
      },
    });

    if (!existingWallet) {
      const newWallet = await prisma.wallet.create({
        data: {
          organisationId: orgId,
          turnover: 0,
        },
      });
      console.info('Wallet new created : ', newWallet);
    } else {
      console.info('Wallet was already created : ', existingWallet);
    }

    // create user if not exist
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!existingUser) {
      const newUser = await prisma.user.create({
        data: {
          organisationId: orgId,
          ...user,
        },
      });
      console.info('User new created : ', newUser);
    } else {
      console.info('User was already created : ', existingUser);
    }

    const usersAfterWork = await (
      await axios.get(process.env.USERS_MANAGER_URL + '/users')
    ).data;

    console.log('Users in USER MANAGER : ', usersAfterWork.length);
    console.log('Current users in USER MANAGER : ', usersAfterWork);

    console.info('Database seed successfully!!');
  } catch (error) {
    throw error;
    return;
  }
}
/*
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });*/
