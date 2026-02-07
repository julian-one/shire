<script lang="ts">
	import { assets, routes } from '$lib/paths';

	let { username, admin }: { username: string | null; admin: boolean } = $props();
</script>

<div class="navbar bg-base-100 sticky top-0 z-50 shadow-sm">
	<div class="navbar-start">
		<a
			href={routes.home}
			class="btn btn-ghost text-xl"
		>
			<img
				src={assets.icon}
				alt=""
				class="size-7"
			/>
		</a>
	</div>
	<div class="navbar-end">
		{#if username}
			<div class="dropdown dropdown-end">
				<div
					tabindex="0"
					role="button"
					class="btn btn-ghost btn-circle avatar avatar-placeholder"
				>
					<div class="bg-neutral text-neutral-content w-10 rounded-full">
						<span>{username.charAt(0).toUpperCase()}</span>
					</div>
				</div>
				<ul
					tabindex="-1"
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
				>
					{#if admin}
						<li><a href={routes.cluster}>cluster</a></li>
					{/if}
					<li><a href={routes.profile}>profile</a></li>
					<li><a href={routes.settings}>settings</a></li>
					<li>
						<form
							method="POST"
							action={routes.logout}
						>
							<button class="w-full text-left">logout</button>
						</form>
					</li>
				</ul>
			</div>
		{:else}
			<a
				href={routes.login}
				class="btn btn-ghost">login</a
			>
		{/if}
	</div>
</div>
