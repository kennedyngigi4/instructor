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
                const res = await fetch('http://127.0.0.1:8000/api/account/login/', {
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
    }

})

