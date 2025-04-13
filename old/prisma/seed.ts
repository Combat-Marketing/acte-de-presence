import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcryptjs"; 

const prisma = new PrismaClient();

async function main() {
    let user: User;
    try {
        user = await prisma.user.upsert({
            where: {
                email: "admin@admin.com",
            },
            update: {
                password: await bcrypt.hash("admin", 10),
            },
            create: {
                email: "admin@admin.com",
                password: await bcrypt.hash("admin", 10),
            },
        });

        console.log("User created, please login with the following credentials:");
        console.log("Email: admin@admin.com");
        console.log("Password: admin");
        console.warn("Please change your credentials after logging in");
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
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
    })