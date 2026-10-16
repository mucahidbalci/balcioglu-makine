import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'balcioglumakina';
  const password = process.env.ADMIN_PASSWORD || 'Eb5754655$$!';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });

  await prisma.settings.upsert({
    where: { id: 'main' },
    update: {},
    create: { id: 'main' },
  });

  console.log('✅ Admin kullanıcı oluşturuldu:', username);
  console.log('✅ Ayarlar tablosu hazır');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());