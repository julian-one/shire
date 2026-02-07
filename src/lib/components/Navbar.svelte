<script lang="ts">
	let { loggedIn }: { loggedIn: boolean } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a
			href="/"
			class="btn btn-ghost text-xl">shire</a
		>
	</div>
	<div class="flex-none">
		{#if loggedIn}
			<div class="dropdown dropdown-end">
				<div
					tabindex="0"
					role="button"
					class="btn btn-ghost btn-circle avatar"
				>
					<div class="w-10 rounded-full">
						<img
							alt="Avatar"
							src="/images/avatar.svg"
						/>
					</div>
				</div>
				<ul
					tabindex="-1"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
				>
					<li><a href="/profile">Profile</a></li>
					<li><a href="/settings">Settings</a></li>
					<li>
						<form
							method="POST"
							action="/logout"
						>
							<button class="w-full text-left">Logout</button>
						</form>
					</li>
				</ul>
			</div>
		{:else}
			<a
				href="/login"
				class="btn btn-ghost">Login</a
			>
		{/if}
	</div>
</div>
