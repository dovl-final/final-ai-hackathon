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
      },
      allowDangerousEmailAccountLinking: true,
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
      // Ensure user exists in database
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!dbUser) {
          // Create new user if they don't exist
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              isAdmin: false, // Default to non-admin
            },
          });
        }

        return true;
      }

      // Deny sign in if no email
      return false;
    },
  },
};
