import { PrismaClient } from '@prisma/client';

// This script makes a user an admin by their email address
// Run with: npx ts-node scripts/make-admin.ts your-email@final.co.il

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  if (!email) {
    console.error('Please provide an email address as argument');
    console.error('Example: npx ts-node scripts/make-admin.ts your-email@final.co.il');
    return;
  }

  try {
    // First check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      console.error('Make sure the user has signed in at least once');
      return;
    }

    // Check if user is already an admin
    if (user.isAdmin) {
      console.log(`${email} is already an admin`);
      return;
    }

    // Update the user to be an admin
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isAdmin: true },
    });

    console.log(`✅ Successfully made ${updatedUser.email} an admin`);
    console.log(`You can now access the admin panel at /admin`);
  } catch (error) {
    console.error('Error making user an admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];
makeAdmin(email);
