import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Later connect MongoDB + Validate user
        if (
          credentials?.email === "test@gmail.com" &&
          credentials?.password === "123456"
        ) {
          return { id: "1", name: "Test User", email: "test@gmail.com" }
        }
        return null
      },
    }),
  ],
  pages: { signIn: "/auth/signin" }, // custom page
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
