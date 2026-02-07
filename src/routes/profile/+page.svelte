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

<main class="flex min-h-screen flex-col items-center justify-center p-4">
	<div class="card bg-base-200 border-base-300 w-full max-w-sm border">
		<div class="card-body items-center text-center">
			<div class="avatar">
				<div class="w-24 rounded-full">
					<img
						alt="Avatar"
						src="/images/avatar.svg"
					/>
				</div>
			</div>

			<h1 class="card-title mt-2 text-2xl">{data.user.username}</h1>
			<p class="text-base-content/70">{data.user.email}</p>

			<div class="badge badge-neutral badge-outline mt-2">{data.user.role}</div>

			<p class="text-base-content/50 mt-4 text-sm">Member since {memberSince}</p>
		</div>
	</div>
</main>
