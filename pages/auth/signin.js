import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

function Signin() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleError = (error) => {
		const errorMap = {
			CredentialsSignin: 'Invalid email or password',
		};
		return errorMap[error] ?? 'Oops something went wrong';
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		signIn('credentials', { email, password, redirect: false })
			.then((res) => {
				console.log(res);
				if (res.ok) {
					router.push('/dashboard');
				} else {
					setError(res.error);
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="max-w-screen h-screen flex justify-center items-center bg-green-100">
			<div>
				{error && (
					<div
						className="text-center p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
						role="alert"
					>
						<span className="font-medium">Error! </span>
						{handleError(error)}
					</div>
				)}
				<form
					onSubmit={handleSubmit}
					className="p-10 flex justify-center items-center flex-col"
				>
					<Image
						alt="logo"
						src="/nakuja_logo.png"
						width="90"
						height="80"
					/>
					<h1 className="font-medium leading-tight text-4xl p-8">
						Login
					</h1>
					<input
						type="email"
						name="email"
						className="mb-5 p-3 w-80 focus:border-blue-300 rounded border-2 outline-none"
						autoComplete="off"
						placeholder="Email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type="password"
						name="password"
						className="mb-5 p-3 w-80 focus:border-blue-300 rounded border-2 outline-none"
						autoComplete="off"
						placeholder="Password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button
						className="bg-blue-500 hover:bg-blue-400 text-white font-bold p-3 rounded w-80"
						id="login"
						type="submit"
					>
						<span>Login</span>
					</button>
				</form>
			</div>
		</div>
	);
}

export default Signin;
