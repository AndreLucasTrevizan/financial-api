import { prismaClient } from ".";

async function main() {
  await prismaClient.nature.upsert({
    where: { name: 'receipt' },
    update: {},
    create: {
      name: 'receipt'
    }
  });

  await prismaClient.nature.upsert({
    where: { name: 'expense' },
    update: {},
    create: {
      name: 'expense'
    }
  });
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async err => {
    console.log(err);
    await prismaClient.$disconnect();
    process.exit(1);
  });
