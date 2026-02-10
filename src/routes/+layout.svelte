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
</script>

<Navbar
	{session}
	{user}
/>
<div class="fixed inset-x-0 top-20 z-50 flex flex-col items-center space-y-4 p-4">
	<Alert />
</div>

<div class="container mx-auto p-4">
	{@render children()}
</div>
