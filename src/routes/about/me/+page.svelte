<script lang="ts">
	import type { Action } from 'svelte/action';
	import { routes } from '$lib/paths';

	let queuedUntil = 0;

	const reveal: Action<HTMLElement, string> = (node, hidden = 'opacity-0 translate-y-10') => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const classes = hidden.split(' ');
		node.classList.add(...classes);
		let timer = 0;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					observer.disconnect();
					const now = performance.now();
					const at = Math.max(now, queuedUntil + 200);
					queuedUntil = at;
					timer = window.setTimeout(() => node.classList.remove(...classes), at - now);
				}
			},
			{ threshold: 0.15, rootMargin: '0px 0px -48px 0px' }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
				clearTimeout(timer);
			}
		};
	};
</script>

<main
	class="carousel carousel-vertical mx-auto h-[calc(100dvh-4rem)] w-full max-w-2xl px-4 lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl"
>
	<div class="carousel-item h-full flex-col justify-center gap-10">
		<h1 class="text-lg md:text-xl">about me</h1>
		<section class="text-base-content/70 max-w-2xl space-y-4 text-sm md:text-base">
			<p>
				well hello there, i'm julian — a senior full-stack engineer in the greater denver, colorado area. i'm a builder
				at heart, a lifelong learner by habit, and i genuinely enjoy the craft of making software that holds up in the
				real world.
			</p>
		</section>
		<div class="text-sm md:text-base">
			<h2>from the beginning — not counting ap cs..</h2>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="text-base-content/40 mt-4 h-5 w-5 animate-bounce"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>

	<section class="text-sm md:text-base">
		<ul class="timeline max-md:timeline-compact timeline-vertical">
			<li class="min-h-[calc(100dvh-4rem)] snap-start">
				<div
					use:reveal={'opacity-0 scale-0'}
					class="timeline-middle transition-all duration-500 ease-out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
						/>
					</svg>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-y-10 md:translate-y-0 md:-translate-x-16'}
					class="timeline-start transition-all duration-700 ease-out md:text-end"
				>
					<img
						src="/images/logos/pitzer.svg"
						alt="pitzer college"
						class="mb-2 block h-8 w-auto md:hidden"
						loading="lazy"
					/>
					<time class="block font-mono italic">august 2013 — may 2017</time>
					<div class="text-lg font-black">ba, biophysics · pitzer college</div>
					<div class="text-base-content/50 text-sm">claremont, ca</div>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-x-16'}
					class="hidden transition-all duration-700 ease-out md:col-start-3 md:row-start-1 md:row-end-4 md:ml-4 md:flex md:self-center md:justify-self-start"
				>
					<img
						src="/images/logos/pitzer.svg"
						alt="pitzer college"
						class="h-10 w-auto"
						loading="lazy"
					/>
				</div>
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
			</li>
			<li class="min-h-[calc(100dvh-4rem)] snap-start">
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
				<div
					use:reveal={'opacity-0 scale-0'}
					class="timeline-middle transition-all duration-500 ease-out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-y-10 md:translate-y-0 md:translate-x-16'}
					class="timeline-end transition-all duration-700 ease-out"
				>
					<img
						src="/images/logos/ucla.svg"
						alt="ucla"
						class="mb-2 block h-5 w-auto brightness-125 md:hidden"
						loading="lazy"
					/>
					<time class="block font-mono italic">august 2017 — july 2020</time>
					<div class="text-lg font-black">program analyst ii & iii · david geffen school of medicine at ucla</div>
					<div class="text-base-content/50 text-sm">full stack · los angeles, ca</div>
					<p class="text-base-content/70 mt-1">
						my first engineering role: building web and mobile apps for medical research teams across the school of
						medicine — wrangling everything from legacy on-premise systems to greenfield aws infrastructure, all within
						hipaa's guardrails.
					</p>
					<div class="mt-2 flex flex-wrap gap-1">
						<span class="badge badge-sm">javascript</span>
						<span class="badge badge-sm">openacs</span>
						<span class="badge badge-sm">postgresql</span>
						<span class="badge badge-sm">oracle</span>
					</div>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm -translate-x-16'}
					class="hidden transition-all duration-700 ease-out md:col-start-1 md:row-start-1 md:row-end-4 md:mr-4 md:flex md:self-center md:justify-self-end"
				>
					<img
						src="/images/logos/ucla.svg"
						alt="ucla"
						class="h-7 w-auto brightness-125"
						loading="lazy"
					/>
				</div>
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
			</li>
			<li class="min-h-[calc(100dvh-4rem)] snap-start">
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
				<div
					use:reveal={'opacity-0 scale-0'}
					class="timeline-middle transition-all duration-500 ease-out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
						/>
					</svg>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-y-10 md:translate-y-0 md:-translate-x-16'}
					class="timeline-start transition-all duration-700 ease-out md:text-end"
				>
					<img
						src="/images/logos/cu.svg"
						alt="university of colorado"
						class="mb-2 block h-9 w-auto md:hidden"
						loading="lazy"
					/>
					<time class="block font-mono italic">august 2020 — may 2022</time>
					<div class="text-lg font-black">ms, computer science · university of colorado</div>
					<div class="text-base-content/50 text-sm">denver, co</div>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-x-16'}
					class="hidden transition-all duration-700 ease-out md:col-start-3 md:row-start-1 md:row-end-4 md:ml-4 md:flex md:self-center md:justify-self-start"
				>
					<img
						src="/images/logos/cu.svg"
						alt="university of colorado"
						class="h-12 w-auto"
						loading="lazy"
					/>
				</div>
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
			</li>
			<li class="min-h-[calc(100dvh-4rem)] snap-start">
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
				<div
					use:reveal={'opacity-0 scale-0'}
					class="timeline-middle transition-all duration-500 ease-out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-y-10 md:translate-y-0 md:translate-x-16'}
					class="timeline-end transition-all duration-700 ease-out"
				>
					<img
						src="/images/logos/dish.svg"
						alt="dish network"
						class="mb-2 block h-6 w-auto md:hidden"
						loading="lazy"
					/>
					<time class="block font-mono italic">february 2022 — november 2023</time>
					<div class="text-lg font-black">senior software engineer · dish network</div>
					<div class="text-base-content/50 text-sm">backend · denver, co</div>
					<p class="text-base-content/70 mt-1">
						the sole senior backend engineer for boost mobile's digital interactions team. i took a creaky legacy
						monolith apart and rebuilt it as scalable microservices, leaning on test-driven development and
						infrastructure as code to keep everything honest.
					</p>
					<div class="mt-2 flex flex-wrap gap-1">
						<span class="badge badge-sm">typescript</span>
						<span class="badge badge-sm">aws cdk</span>
						<span class="badge badge-sm">eks</span>
						<span class="badge badge-sm">postgresql</span>
					</div>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm -translate-x-16'}
					class="hidden transition-all duration-700 ease-out md:col-start-1 md:row-start-1 md:row-end-4 md:mr-4 md:flex md:self-center md:justify-self-end"
				>
					<img
						src="/images/logos/dish.svg"
						alt="dish network"
						class="h-8 w-auto"
						loading="lazy"
					/>
				</div>
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
			</li>
			<li class="min-h-[calc(100dvh-4rem)] snap-start">
				<hr
					use:reveal={'scale-y-0'}
					class="origin-top transition-transform duration-500 ease-out"
				/>
				<div
					use:reveal={'opacity-0 scale-0'}
					class="timeline-middle transition-all duration-500 ease-out"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-y-10 md:translate-y-0 md:-translate-x-16'}
					class="timeline-start transition-all duration-700 ease-out md:text-end"
				>
					<img
						src="/images/logos/westhill-white.png"
						alt="westhill"
						class="mb-2 block h-5 w-auto md:hidden"
						loading="lazy"
					/>
					<time class="block font-mono italic">december 2023 — present</time>
					<div class="text-lg font-black">senior software engineer · westhill global</div>
					<div class="text-base-content/50 text-sm">full stack · remote</div>
					<p class="text-base-content/70 mt-1">
						these days i lead development at a startup connecting insurance carriers, homeowners, and contractors
						through a fully-digital managed repair experience. i wear a lot of hats here — designing infrastructure from
						requirements through delivery, rearchitecting for scale and fault tolerance, and guiding sprint planning and
						code reviews.
					</p>
					<div class="mt-2 flex flex-wrap gap-1 md:justify-end">
						<span class="badge badge-sm">svelte</span>
						<span class="badge badge-sm">go</span>
						<span class="badge badge-sm">gcp</span>
					</div>
				</div>
				<div
					use:reveal={'opacity-0 blur-sm translate-x-16'}
					class="hidden transition-all duration-700 ease-out md:col-start-3 md:row-start-1 md:row-end-4 md:ml-4 md:flex md:self-center md:justify-self-start"
				>
					<img
						src="/images/logos/westhill-white.png"
						alt="westhill"
						class="h-6 w-auto"
						loading="lazy"
					/>
				</div>
			</li>
		</ul>
	</section>

	<div class="carousel-item h-full flex-col justify-center">
		<p class="text-sm md:text-base">
			<a
				href={routes.aboutSite}
				class="link link-hover">about this site →</a
			>
		</p>
	</div>
</main>
