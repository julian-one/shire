<script lang="ts">
	import { onMount } from 'svelte';
	import moment from 'moment';
	import type { Session } from '$lib/types/session';
	import { SessionStore, ClearAuthData } from '$lib/stores/session';

	let session = $derived($SessionStore);

	onMount(() => {
		if (!session) {
			window.location.href = `/login`;
			return;
		}

		const expiration = moment((session as Session).expires_at);
		const now = moment();

		if (!expiration.isValid()) {
			ClearAuthData();
			window.location.href = `/login`;
			return;
		}

		if (now.isAfter(expiration)) {
			ClearAuthData();
			window.location.href = `/login`;
			return;
		}

		window.location.href = '/profile';
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<span class="loading loading-spinner loading-xl"></span>
</div>
