const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const users = [
  {
    organisationId: 'b33a301f-ac95-4909-bea5-76a59de5c07f',
    engineId: '8297c513-7176-45b3-aa34-77b5a1d69b54',
    name: 'Utilisateur Test 1',
    phone: '22990000000',
    email: 'usertest1@email.com',
    address: 'Adress user 1',
    birthday: '1998-02-16',
    sex: 'male',
    status: 'active',
    role: 'deliveryMan',
    permission: 'deliveryMan',
  },
  {
    organisationId: 'ba569b85-d2d1-434f-9e8a-520f359ed547',
    engineId: 'e39557bc-bac5-4ed8-8c46-ca27aba653c8',
    name: 'Utilisateur Test 2',
    phone: '22951874156',
    email: 'usertest2@email.com',
    address: 'Adress user 2',
    birthday: '1998-02-17',
    sex: 'male',
    status: 'suspended',
    role: 'deliveryMan',
    permission: 'deliveryMan',
  },
  {
    organisationId: 'ca4b7a8b-e671-40fe-93a8-0f1e0d547477',
    engineId: 'fcf7405d-17ce-406a-8e92-dd9b4953a2f6',
    name: 'Utilisateur Test 3',
    phone: '22978524639',
    email: 'usertest3@email.com',
    address: 'Adress user 3',
    birthday: '1998-02-18',
    sex: 'female',
    status: 'inactive',
    role: 'deliveryMan',
    permission: 'deliveryMan',
  },
];

async function main() {
  try {
    const newUser = await prisma.user.createMany({
      data: users,
    });
    console.info('Organisation created : ', newUser);
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
