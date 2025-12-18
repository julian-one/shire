<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { ClearAuthData } from '$lib/stores/session';
	import { AuthController } from '$lib/controllers/auth';

	onMount(async () => {
		ClearAuthData();

		try {
			const auth = new AuthController();
			auth.Logout();
		} catch (error) {
			console.error('Error in logout proxy route:', error);
		}

		// Do I need this logic?
		let redirect = page.url.searchParams.get('redirect');
		if (redirect) {
			window.location.href = `/login?redirect=${redirect}`;
		} else {
			window.location.href = '/login';
		}
	});
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<span class="loading loading-spinner text-primary loading-xl"></span>
</div>
