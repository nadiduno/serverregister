const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    await prisma.migrate({ force: true });
    console.log('Migrações do Prisma executadas com sucesso!');
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
