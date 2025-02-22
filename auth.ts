import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const { handlers, signIn, signOut, auth  } = NextAuth({

    pages: {
        signIn: "/signin"
    },

    providers: [
        Credentials({
            credentials : {
                email : {},
                password: {}
            },
            async authorize(credentials, req){
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login/`, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const user = await res.json();

                if (user.message == "success"){
                    console.log(user)
                    return user;
                } 
                return null;
            }
        })
    ],

    session: {
        strategy: "jwt",
    },


    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.access;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.id = token.id;
            return session;
        },
    },
    trustHost: true,
    AUTH_TRUST_HOST: true,

})

