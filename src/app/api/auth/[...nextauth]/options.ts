import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import connectDB from "@/src/db/connectDB";
import NextAuth, { User, Session, CredentialsSignin } from "next-auth";
import { JWT } from "next-auth/jwt";
import UserModel from "@/src/models/user.model";
import { IUser } from "@/src/types/user";

type extendedUser = IUser & { isLoggingIn: string };

export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isLoggingIn: { type: "boolean" },
      },
      async authorize(
        credentials: Partial<
          Record<"username" | "email" | "password" | "isLoggingIn", unknown>
        >
      ) {
        try {
          const { username, email, password, isLoggingIn } =
            credentials as extendedUser;
          const error = new CredentialsSignin();

          await connectDB();
          let user = await UserModel.findOne({ email }).select("+password");

          if (isLoggingIn === "true") {
            if (!user) {
              error.code = "User not found";
              throw error;
            }

            const isPasswordCorrect = await bcrypt.compare(
              password as string,
              user.password!
            );

            if (!isPasswordCorrect) {
              error.code = "Incorrect Password";
              throw error;
            }
          } else {
            if (user) {
              error.code = "User already exists. Please Login";
              throw error;
            }

            user = await UserModel.create({
              username,
              email,
              password,
            });
          }

          return {
            id: user._id!.toString(),
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.log(error);
          const credentiaslError = new CredentialsSignin();
          if (error instanceof CredentialsSignin) throw error;
          if (error instanceof Error) {
            credentiaslError.code = error.message;
            throw credentiaslError;
          }
          credentiaslError.code =
            "An unexpected error occurred. Please try again.";
          throw credentiaslError;
        }
      },
    }),
  ],
  callbacks: {
    async signIn(params) {
      let authType;
      try {
        const { user, account } = params;

        await connectDB();

        if (account?.provider === "credentials") return true;

        const cookieStore = await cookies();
        authType = cookieStore.get("authType")?.value;

        if (!authType)
          return `/${authType}?code=Type of Authentication not found`;

        const existingUser = await UserModel.findOne({ email: user.email });

        if (authType === "sign-up") {
          if (existingUser) return `/${authType}?code=User already exists`;

          const newUser = await UserModel.create({
            username: user.name,
            email: user.email,
          });

          user.id = newUser._id!.toString();
        } else {
          if (!existingUser) return `/${authType}?code=User not found`;

          user.id = existingUser._id!.toString();
        }

        return true;
      } catch (error) {
        if (error instanceof Error) return `/${authType}?code=${error.message}`;

        return `/${authType}?code=Unknown authorization error`;
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 15 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
