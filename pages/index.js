import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

function Home() {
	return (
		<div className="lg:max-h-screen max-w-screen overflow-hidden">
			<Head>
				<title>Base Station</title>
				<meta
					name="description"
					content="Ground station for nakuja project"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col justify-center items-center h-screen  bg-green-100">
				<Image
					alt="logo"
					src="/nakuja_logo.png"
					width="90"
					height="80"
				/>
				<h1 className="font-medium leading-tight text-4xl">
					Nakuja Project
				</h1>
				<button className="my-4 bg-transparent hover:bg-blue-500 text-blue-700 text-sm font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent w-2/6 lg:w-1/6 h-16">
					<Link href="/dashboard">Dashboard</Link>
				</button>
				<button
					className="my-4 bg-transparent hover:bg-blue-500 text-blue-700 text-sm font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent  w-2/6 lg:w-1/6 h-16"
					onClick={() => signIn()}
				>
					Login
				</button>
			</main>
		</div>
	);
}

export default Home;
