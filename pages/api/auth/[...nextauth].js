import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
    providers: [
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({token, profile }) {
            if (profile) {
                token['userProfile'] = profile
            }
            return token
        },
        async session({session, token}) {
            session.user.id = token.userProfile.id;
            session.user.screen_name = token.userProfile.screen_name;
            session.user.id_str = token.userProfile.id_str;
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET
})