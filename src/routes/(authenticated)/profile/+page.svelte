<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const memberSince = $derived(
		new Date(data.user.created_at).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<main class="hero flex-1">
	<div class="hero-content w-full">
		<div class="card card-border bg-base-200 w-full max-w-sm">
			<div class="card-body items-center text-center">
				<div class="avatar avatar-placeholder">
					<div class="bg-neutral text-neutral-content w-24 rounded-full">
						<span class="text-3xl">{data.user.username.charAt(0).toUpperCase()}</span>
					</div>
				</div>

				<h1 class="card-title mt-2 text-2xl">{data.user.username}</h1>
				<p class="text-base-content/70">{data.user.email}</p>

				<div class="badge badge-neutral badge-outline mt-2">{data.user.role}</div>

				<p class="text-base-content/50 mt-4 text-sm">member since {memberSince}</p>
			</div>
		</div>
	</div>
</main>
