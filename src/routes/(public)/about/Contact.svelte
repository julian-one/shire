<script lang="ts">
	import { asset } from '$app/paths';
	import {
		CaretRightIcon,
		EnvelopeSimpleIcon,
		FilePdfIcon,
		GithubLogoIcon,
		LinkedinLogoIcon
	} from 'phosphor-svelte';

	type Contact = {
		name: string;
		address: string;
		href: string;
		icon: typeof EnvelopeSimpleIcon;
		rel?: string;
		download?: string;
	};

	const contacts: Contact[] = [
		{
			name: 'Email',
			address: 'hollows.excuse.6v@icloud.com',
			href: 'mailto:hollows.excuse.6v@icloud.com',
			icon: EnvelopeSimpleIcon
		},
		{
			name: 'Resume',
			address: 'One-page PDF',
			href: asset('JulianRoberts_Resume.pdf'),
			icon: FilePdfIcon,
			download: 'JulianRoberts_Resume.pdf'
		},
		{
			name: 'GitHub',
			address: 'github.com/julian-one',
			href: 'https://github.com/julian-one',
			icon: GithubLogoIcon,
			rel: 'me'
		},
		{
			name: 'LinkedIn',
			address: 'linkedin.com/in/julian-one',
			href: 'https://www.linkedin.com/in/julian-one/',
			icon: LinkedinLogoIcon,
			rel: 'me'
		}
	];
</script>

<ul class="list lg:grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-2">
	{#each contacts as contact, index (contact.name)}
		<li class="relative">
			<a
				class="group list-row min-h-16 items-center lg:after:hidden"
				href={contact.href}
				target="_blank"
				rel={contact.rel}
				download={contact.download}
			>
				<contact.icon class="size-6 shrink-0" aria-hidden="true" />
				<span class="flex flex-wrap items-baseline gap-x-4 gap-y-1">
					<span class="min-w-22 text-lg font-bold underline-offset-6 group-hover:underline">
						{contact.name}
					</span>
					<span class="wrap-anywhere text-secondary">{contact.address}</span>
				</span>
				<CaretRightIcon
					class="size-5 shrink-0 text-secondary transition-transform group-hover:translate-x-1 group-hover:text-base-content"
					aria-hidden="true"
				/>
			</a>
			{#if index < 2}
				<span
					class="absolute inset-y-3.5 end-0 hidden border-e-2 border-base-content/5 lg:block"
					aria-hidden="true"
				></span>
			{/if}
		</li>
	{/each}
</ul>
