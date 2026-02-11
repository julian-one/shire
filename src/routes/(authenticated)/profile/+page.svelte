<script lang="ts">
	import { AuthStore } from '$lib/stores/auth.svelte';
	import Profile from './profile-details.svelte';

	let user = $derived(AuthStore.user);
</script>

{#if user}
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col items-center gap-6">
			<Profile {user} />
		</div>
	</div>
{/if}
