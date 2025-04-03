import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import prisma from "@/app/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
});
