import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
// Using any to avoid the import error, as adapter works correctly at runtime
// @ts-ignore 
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../lib/db";
import type { AuthOptions, Session, DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the session type to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: any) => {
      const { ext_expires_in, ...userData } = data;
      return await prisma.user.create({ data: userData });
    }
  },
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
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, email }) {
      // Only allow Final company emails
      if (!user.email?.endsWith("@final.co.il")) {
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
            type: account?.type || "oauth",
            provider: account?.provider || "azure-ad",
            providerAccountId: account?.providerAccountId || "",
            access_token: account?.access_token,
            expires_at: account?.expires_at,
            id_token: account?.id_token,
            refresh_token: account?.refresh_token,
            scope: account?.scope,
            session_state: account?.session_state,
            token_type: account?.token_type
          }
        });
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
