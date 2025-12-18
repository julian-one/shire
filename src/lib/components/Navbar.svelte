<script lang="ts">
	import { SessionStore } from '$lib/stores/session';

	let session = $derived($SessionStore);
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a
			class="btn btn-ghost text-xl"
			href={session ? '/home' : '/'}>jroberts</a
		>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#if session}
				<li><a href="/profile">Profile</a></li>
				<li><a href="/logout">Logout</a></li>
			{:else}
				<li><a href="/login">Login</a></li>
				<li><a href="/register">Register</a></li>
			{/if}
		</ul>
	</div>
</div>
