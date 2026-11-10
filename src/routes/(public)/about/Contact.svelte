<script lang="ts">
	import {
		CaretRightIcon,
		EnvelopeSimpleIcon,
		GithubLogoIcon,
		LinkedinLogoIcon
	} from 'phosphor-svelte';

	type Contact = {
		name: string;
		address: string;
		href: string;
		icon: typeof EnvelopeSimpleIcon;
		rel?: string;
	};

	const contacts: Contact[] = [
		{
			name: 'Email',
			address: 'paid_firebox6a@icloud.com',
			href: 'mailto:paid_firebox6a@icloud.com',
			icon: EnvelopeSimpleIcon
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

	const lastIndex = contacts.length - 1;
</script>

<ul class="list lg:grid lg:grid-cols-3">
	{#each contacts as contact, index (contact.name)}
		<li class="relative">
			<a
				class="group list-row min-h-16 items-center lg:after:hidden"
				href={contact.href}
				rel={contact.rel}
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
			{#if index < lastIndex}
				<span
					class="absolute inset-y-3.5 end-0 hidden border-e-2 border-base-content/5 lg:block"
					aria-hidden="true"
				></span>
			{/if}
		</li>
	{/each}
</ul>
