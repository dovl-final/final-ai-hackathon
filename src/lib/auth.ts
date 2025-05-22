import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";
import type { AuthOptions, DefaultSession } from "next-auth";

// Extend the session type to include user.id
declare module "next-auth" {
  interface User {
    id: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

export const authOptions: AuthOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (data: { email: string; name?: string; image?: string; [key: string]: any }) => {
      // Filter out any unnecessary fields before creating the user
      const { email, name, image } = data;
      return await prisma.user.create({ 
        data: { 
          email, 
          name, 
          image,
          isAdmin: false, // Default to non-admin
        } 
      });
    },
  },
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = user.id;
        session.user.isAdmin = user.isAdmin;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async signIn({ user, account }) {
      // The Prisma adapter will handle user creation and account linking.
      // This callback can be used for custom logic to allow/deny sign-in
      // based on email domain, account properties, etc., if needed.
      if (user?.email) {
        // For now, simply allow sign-in if an email is present.
        // The adapter will create the user if they don't exist or link the account.
        return true;
      }

      // Deny sign in if no email or other conditions aren't met
      return false;
    },
  },
};
