import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { clientPromise } from "@/lib/mongoose";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

/**
 * Extended Session type for NextAuth
 * Adds user ID to the session object
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      subscriptionTier?: string;
      subscriptionStatus?: string;
    }
  }
}

/**
 * NextAuth configuration options
 * Supports multiple authentication providers:
 * - GitHub
 * - Google
 * - Email/Password
 * 
 * Uses MongoDB adapter for session storage
 */
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please fill in all fields');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        if (!user.password) {
          throw new Error('Please sign in with Google or GitHub');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image
        };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await dbConnect();
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            existingUser.name = user.name;
            existingUser.image = user.image;
            await existingUser.save();
          }
        } catch (error) {
          console.error("Error checking user:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (token.email) {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.subscriptionTier = dbUser.subscriptionTier || 'free';
          token.subscriptionStatus = dbUser.subscriptionStatus;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.subscriptionTier = (token as any).subscriptionTier || 'free';
        session.user.subscriptionStatus = (token as any).subscriptionStatus;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
};