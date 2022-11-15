import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
	// session: {
	// 	strategy: 'jwt',
	// },
	// Configure one or more authentication providers
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: 'Credentials',
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {},
			async authorize(credentials, req) {
				// Add logic here to look up the user from the credentials supplied
				const { email, password } = credentials;

				if (email !== 'cyator@gmail.com' || password !== 'nakuja') {
					return null;
				}

				const user = {
					id: 1,
					email,
				};

				// Any object returned will be saved in `user` property of the JWT
				return user;
			},
		}),
	],
	pages: {
		signIn: '/auth/signin',
	},
};

export default NextAuth(authOptions);
