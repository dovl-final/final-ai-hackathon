import { PrismaClient } from '@prisma/client';

// This script makes a user an admin by their email address
// Run with: npx ts-node scripts/make-admin.ts

const prisma = new PrismaClient();

async function makeAdmin() {
  // Replace with the email of the user you want to make an admin
  const email = 'your-email@final.co.il';

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });

    console.log(`Successfully made ${updatedUser.email} an admin`);
  } catch (error) {
    console.error('Error making user an admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
