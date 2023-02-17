const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const organisations = [
  {
    socialReason: 'Maison Mere Snb',
    fiscalId: 'IFUDFG4D6B4R',
    phone: '22951879399',
    email: 'snb@organisation.com',
    adress: 'Cotonou Menontin',
    ownerName: 'Mr Du Dingo',
    paymentDeadline: 120,
    status: 'active',
    type: 'snb',
  },
  {
    socialReason: 'Distributeur agréé 1',
    fiscalId: 'IFUDFG4Dfdhd54R',
    phone: '229518793457',
    email: 'da1@organisation.com',
    adress: 'Cotonou Menontin',
    ownerName: 'Mr Du Dingo : DA 1',
    paymentDeadline: 120,
    status: 'active',
    type: 'da',
  },
  {
    socialReason: 'Master Distributeur 1',
    fiscalId: 'IFUDFdf3fdhd54R',
    phone: '229547893457',
    email: 'md1@organisation.com',
    adress: 'Cotonou Menontin',
    ownerName: 'Mr Du Dingo : MD 1',
    paymentDeadline: 120,
    status: 'active',
    type: 'md',
  },
];

async function main() {
  try {
    const newOrganisation = await prisma.organisation.createMany({
      data: organisations,
    });
    console.info('Organisation created : ', newOrganisation);
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
