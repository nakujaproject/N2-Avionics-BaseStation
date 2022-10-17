import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

function Video() {
	const image = useRef();
	const [error, setError] = useState(false);

	useEffect(() => {
		if (image.current) {
			gsap.to(image.current, {
				rotation: '+=360',
				scale: 0.5,
				repeat: -1,
				yoyo: true,
				duration: 0.7,
				ease: 'power2.inOut',
			});
		}
	}, [error]);

	return (
		<>
			{error ? (
				<div className="w-full h-[297px] md:h-[603px] lg:h-[354px] bg-black flex justify-center items-center">
					<div ref={image}>
						<Image
							alt="logo"
							src="/nakuja_logo.png"
							width="90"
							height="80"
						/>
					</div>
				</div>
			) : (
				<Image
					alt="stream"
					src="http://192.168.4.4:81/stream"
					width={800}
					height={600}
					layout="responsive"
					priority
					unoptimized
					placeholder="blur"
					blurDataURL="/placeholder.jpg"
					onError={() => setError(true)}
				/>
			)}
		</>
	);
}

export default Video;
