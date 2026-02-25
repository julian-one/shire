<script lang="ts">
	import Profile from './details.svelte';

	let { data } = $props();

	let user = $derived(data.user);
</script>

{#if user}
	<div class="container mx-auto px-4 py-8">
		<div class="flex flex-col items-center gap-6">
			<Profile {user} />
		</div>
	</div>
{/if}
