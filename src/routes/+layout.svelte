<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Alert from '$lib/components/Alert.svelte';

	let { children, data } = $props();

	let session = $derived(data.session);
	let user = $derived(data.user);
	let theme = $derived(data.theme);

	// Suppress the browser's native validation popup (the black tooltip bubble)
	// on all form inputs site-wide. When an input fails constraint validation
	// (e.g. required, pattern, minlength), the browser fires an "invalid" event
	// and shows its own tooltip. Calling preventDefault() on that event stops
	// the tooltip from appearing. We rely on DaisyUI's `validator` class and
	// `validator-hint` elements to show inline validation messages instead.
	$effect(() => {
		const suppress = (e: Event) => e.preventDefault();
		// Use capture phase (third arg = true) so this runs before any other
		// handlers and intercepts the event on every input in the document,
		// regardless of which form or component it belongs to.
		document.addEventListener('invalid', suppress, true);
		// Cleanup: remove the listener when the layout is destroyed.
		return () => document.removeEventListener('invalid', suppress, true);
	});
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
