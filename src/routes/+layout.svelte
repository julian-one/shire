<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let { children, data } = $props();

	let session = $derived(data.session);
	let user = $derived(data.user);
	let theme = $derived(data.theme);
</script>

<Navbar
	{session}
	{user}
	bind:theme
/>
<Alert />

<div class="container mx-auto p-4">
	{@render children()}
</div>
