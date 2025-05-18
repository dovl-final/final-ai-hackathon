var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// Using any to avoid the import error, as adapter works correctly at runtime
// @ts-ignore 
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/db";
export const authOptions = {
    adapter: Object.assign(Object.assign({}, PrismaAdapter(prisma)), { createUser: async (data) => {
            const { ext_expires_in } = data, userData = __rest(data, ["ext_expires_in"]);
            return await prisma.user.create({ data: userData });
        } }),
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || "",
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
            tenantId: process.env.AZURE_AD_TENANT_ID,
            // Only allow Final company emails
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        CredentialsProvider({
            name: "Admin Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "admin@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !credentials.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (user && user.isAdmin && user.hashedPassword) {
                    const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
                    if (isValidPassword) {
                        // Return only necessary user fields for the session
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                            isAdmin: user.isAdmin, // Include isAdmin status
                        };
                    }
                }
                return null; // Return null if authentication fails
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile, email }) {
            var _a;
            // Only allow Final company emails
            if (!((_a = user.email) === null || _a === void 0 ? void 0 : _a.endsWith("@final.co.il"))) {
                return false;
            }
            // If we have a user with this email but no account, link them
            const existingUser = await prisma.user.findUnique({
                where: { email: user.email },
                include: { accounts: true }
            });
            if (existingUser && existingUser.accounts.length === 0) {
                await prisma.account.create({
                    data: {
                        userId: existingUser.id,
                        type: (account === null || account === void 0 ? void 0 : account.type) || "oauth",
                        provider: (account === null || account === void 0 ? void 0 : account.provider) || "azure-ad",
                        providerAccountId: (account === null || account === void 0 ? void 0 : account.providerAccountId) || "",
                        access_token: account === null || account === void 0 ? void 0 : account.access_token,
                        expires_at: account === null || account === void 0 ? void 0 : account.expires_at,
                        id_token: account === null || account === void 0 ? void 0 : account.id_token,
                        refresh_token: account === null || account === void 0 ? void 0 : account.refresh_token,
                        scope: account === null || account === void 0 ? void 0 : account.scope,
                        session_state: account === null || account === void 0 ? void 0 : account.session_state,
                        token_type: account === null || account === void 0 ? void 0 : account.token_type
                    }
                });
            }
            return true;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.uid; // Use token.uid as set in jwt callback
                if (token.isAdmin !== undefined) {
                    session.user.isAdmin = token.isAdmin;
                }
            }
            return session;
        },
        async jwt({ token, user, account }) {
            if (user) { // user is only passed on initial sign-in
                token.uid = user.id;
                // Explicitly check if user comes from credentials provider and has isAdmin
                // The `user` object passed to jwt callback is the one from `authorize` or adapter
                if (user.isAdmin !== undefined) {
                    token.isAdmin = user.isAdmin;
                }
            }
            return token;
        },
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
