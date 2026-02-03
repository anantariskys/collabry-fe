import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Direct axios call to backend login endpoint
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          // Response structure:
          // { 
          //   success: true, 
          //   message: 'Login successful', 
          //   data: { 
          //     user: { ... }, 
          //     token: '...' 
          //   } 
          // }
          const responseData = res.data;
          
          if (responseData.success && responseData.data) {
            const { user, token } = responseData.data;
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              accessToken: token,
            };
          }
          return null;
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
};
