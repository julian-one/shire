<script lang="ts">
	import '../app.css';
	import { AuthStore } from '$lib/stores/auth.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let { children, data } = $props();

	// Sync server data to client store
	$effect(() => {
		if (data) {
			AuthStore.init(data.session, data.user);
		}
	});

	let session = $derived(AuthStore.session);
	let user = $derived(AuthStore.user);

	// We use $state and sync it with data.theme via $effect.
	// This is the most reliable way to have a mutable theme state that
	// also reacts to server-side changes (like navigation).
	// eslint-disable-next-line svelte/prefer-writable-derived
	let theme = $state(data.theme);

	$effect(() => {
		theme = data.theme;
	});
</script>

<Navbar
	{session}
	{user}
	bind:theme
/>
<div class="fixed inset-x-0 top-20 z-50 flex flex-col items-center space-y-4 p-4">
	<Alert />
</div>

<div class="container mx-auto p-4">
	{@render children()}
</div>
