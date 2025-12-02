import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { env } from "@/env";

import { UserServiceAdapter } from "@/lib/user-service-adapter";

const handler = NextAuth({
  adapter: new UserServiceAdapter(),
  providers: [GoogleProvider({
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
  })],
  pages: {
    signIn: '/sign-in'
  },  
})

export { handler as GET, handler as POST }
