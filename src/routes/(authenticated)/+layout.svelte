<script lang="ts">
	import { SessionStore } from '$lib/stores/session';

	let { children } = $props();
	let session = $derived($SessionStore);
</script>

{#if session}
	{@render children()}
{/if}
