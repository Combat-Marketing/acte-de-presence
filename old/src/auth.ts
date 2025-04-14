import prisma from "@/prisma";
import { signInSchema } from "@admin/lib/validation/signin";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const { handlers, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "Sign in",
            id: "credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "********",
                },
            },
            async authorize(credentials): Promise<User | null> {
                console.log(credentials);
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials);
                    console.log(email, password);
                    const user = await prisma.user.findUnique({
                        where: { email },
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        return null;
                    }

                    return user;
                } catch (error) {
                    if (error instanceof ZodError) {
                        console.error(error.message);
                        throw new Error(error.message);
                        return null;
                    }
                    console.error(error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        authorized: async ({ auth, request: { nextUrl } }) => {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/admin") && !nextUrl.pathname.startsWith("/admin/login");
    
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                const signInUrl = new URL("/admin/login", nextUrl);
                return NextResponse.redirect(signInUrl);
            }
    
            return true;
        },
    },
});
