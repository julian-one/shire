<script lang="ts">
	import Profile from './Profile.svelte';

	let { data } = $props();

	let user = $derived(data.user);
</script>

{#if user}
	<div class="flex flex-col items-center gap-6 pb-8 md:pb-12">
		<Profile {user} />
	</div>
{/if}
