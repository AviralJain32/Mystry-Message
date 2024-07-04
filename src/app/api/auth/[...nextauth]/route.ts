import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler=NextAuth(authOptions)

console.log("in route/ opotions page ")
export {handler as GET,handler as POST}
