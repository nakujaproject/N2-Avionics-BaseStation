import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Map from './Map';

function Video({ url }) {
	console.log('video', url);
	const image = useRef();
	const [error, setError] = useState(false);
	let [stream,setStream] = useState(false);

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
			<div className='choice'>
				<button id={stream?'':'active'} onClick={(e)=>{setStream(false)}}>Map</button>
				<button id={stream?'active':''} onClick={(e)=>{setStream(true)}}>Live Stream</button>
			</div>
			{stream ? (
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
			) :
			<Map/>
			}
		</>
	);
}

export default Video;
