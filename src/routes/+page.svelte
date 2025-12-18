<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen">
	<main class="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-8">
		<div class="text-center">
			<h1 class="mb-6 text-6xl font-bold text-gray-900">
				Welcome to <span class="text-blue-600">Pippaothy</span>
			</h1>

			{#if data.user}
				<p class="mb-8 text-xl text-gray-600">
					Welcome back, <span class="font-semibold">{data.user.username}</span>!
				</p>
				<div class="flex justify-center gap-4">
					<a
						href="/profile"
						class="rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
					>
						View Profile
					</a>
				</div>
			{:else}
				<p class="mb-8 text-xl text-gray-600">
					Your secure authentication and user management platform
				</p>
				<div class="flex justify-center gap-4">
					<a
						href="/register"
						class="rounded-md bg-blue-600 px-6 py-3 text-lg font-medium text-white hover:bg-blue-700"
					>
						Get Started
					</a>
					<a
						href="/login"
						class="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
					>
						Sign In
					</a>
				</div>
			{/if}

			<div class="mt-16 grid gap-8 md:grid-cols-3">
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
						<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Secure Authentication</h3>
					<p class="text-gray-600">JWT-based authentication with refresh token rotation</p>
				</div>

				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
						<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">User Management</h3>
					<p class="text-gray-600">Complete profile management and account settings</p>
				</div>

				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
						<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">Built with SvelteKit</h3>
					<p class="text-gray-600">Modern, fast, and reactive user interface</p>
				</div>
			</div>
		</div>
	</main>
</div>
