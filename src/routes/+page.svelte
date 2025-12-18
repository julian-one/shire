<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="hero min-h-screen bg-base-200">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-5xl font-bold">
				Welcome to <span class="text-primary">Pippaothy</span>
			</h1>

			{#if data.user}
				<p class="py-6">
					Welcome back, <span class="font-semibold">{data.user.username}</span>!
				</p>
				<a href="/profile" class="btn btn-primary">View Profile</a>
			{:else}
				<p class="py-6">Your secure authentication and user management platform</p>
				<div class="flex justify-center gap-4">
					<a href="/register" class="btn btn-primary">Get Started</a>
					<a href="/login" class="btn btn-outline">Sign In</a>
				</div>
			{/if}
		</div>
	</div>
</div>
