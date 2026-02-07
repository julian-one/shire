<script>
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Alert from '$lib/components/Alert.svelte';
	let { children } = $props();
</script>

<Navbar />
<div class="fixed inset-x-0 top-20 z-50 flex flex-col items-center space-y-4 p-4">
	<Alert />
</div>

<div class="container mx-auto p-4">
	{@render children()}
</div>
