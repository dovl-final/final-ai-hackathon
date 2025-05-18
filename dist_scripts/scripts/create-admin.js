import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';
import readline from 'readline';
const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}
async function main() {
    console.log('Creating a new admin user...');
    const email = await askQuestion('Enter admin email: ');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        console.error('Invalid email format. Aborting.');
        rl.close();
        return;
    }
    const password = await askQuestion('Enter admin password (will be hashed): ');
    if (!password || password.length < 8) {
        console.error('Password must be at least 8 characters long. Aborting.');
        rl.close();
        return;
    }
    const confirmPassword = await askQuestion('Confirm admin password: ');
    if (password !== confirmPassword) {
        console.error('Passwords do not match. Aborting.');
        rl.close();
        return;
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            console.error(`Error: User with email '${email}' already exists.`);
            if (existingUser.isAdmin) {
                console.log('This user is already an admin.');
            }
            else {
                const makeAdmin = await askQuestion(`User '${email}' exists but is not an admin. Make this user an admin and set this password? (yes/no): `);
                if (makeAdmin.toLowerCase() === 'yes') {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const updatedUser = await prisma.user.update({
                        where: { email },
                        data: {
                            isAdmin: true,
                            hashedPassword: hashedPassword, // Update password as well for security
                        },
                    });
                    console.log(`User '${updatedUser.email}' is now an admin.`);
                }
                else {
                    console.log('Operation cancelled by user.');
                }
            }
            // Ensure rl is closed before returning from this path
            rl.close();
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminUser = await prisma.user.create({
            data: {
                email,
                hashedPassword,
                name: 'Admin User', // You can prompt for this too if needed
                isAdmin: true,
                // emailVerified: new Date(), // Optional: mark as verified if creating directly
            },
        });
        console.log(`Admin user created successfully!`);
        console.log(`Email: ${adminUser.email}`);
        console.log(`Is Admin: ${adminUser.isAdmin}`);
        console.log('IMPORTANT: Please ensure this script is not run in production environments or committed with sensitive default credentials.');
    }
    catch (error) {
        console.error('Error creating admin user:', error);
    }
    finally {
        rl.close();
        await prisma.$disconnect().catch((e) => console.error('Failed to disconnect Prisma during normal flow', e));
    }
}
main().catch((e) => {
    console.error('Unhandled error in main:', e);
    rl.close();
    prisma.$disconnect().catch((err) => console.error('Failed to disconnect Prisma on error', err))
        .finally(() => process.exit(1));
});
