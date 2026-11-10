<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AuthController from '#lib/controllers/auth.js';
	import { ToastStore } from '#lib/stores/toasts.svelte.js';
	import ThemeToggle from '#lib/components/ThemeToggle.svelte';
	import type { User } from '#lib/types/user.js';
	import { GearIcon, SignOutIcon } from 'phosphor-svelte';

	let { user }: { user: User } = $props();

	const auth = new AuthController();
	const settingsHref = resolve('/(authenticated)/settings');
	const initial = $derived(user.username.charAt(0).toUpperCase());
	const onSettings = $derived(page.url.pathname === settingsHref);

	let menu: HTMLElement | undefined;

	async function logout() {
		try {
			await auth.logout();
		} catch {
			ToastStore.error('Sign out failed.', 'Please try again.');
			return;
		}
		await goto(resolve('/(unauthenticated)/login'));
	}
</script>

<button
	class="btn btn-circle size-11 border-primary bg-base-100 text-lg font-bold text-primary hover:ring-2 hover:ring-base-300 hover:ring-offset-2 hover:ring-offset-base-100"
	type="button"
	popovertarget="account-menu"
	aria-label="Account menu for {user.username}"
	style="anchor-name: --account-menu"
>
	{initial}
</button>
<div
	bind:this={menu}
	id="account-menu"
	class="dropdown dropdown-end mt-2 min-w-60 rounded-box border-2 border-base-300 bg-base-100 p-2"
	popover
	style="position-anchor: --account-menu"
>
	<div class="mb-1 flex items-center gap-3 ps-3 pt-1 pb-2">
		<div class="flex min-w-0 grow flex-col gap-0.5">
			<span class="font-bold">{user.username}</span>
			<span class="text-sm wrap-anywhere text-secondary">{user.email}</span>
		</div>
		<ThemeToggle />
	</div>
	<ul class="menu w-full p-0">
		<li>
			<a
				class="min-h-11 gap-2.5 font-bold"
				href={settingsHref}
				aria-current={onSettings ? 'page' : undefined}
				onclick={() => {
					menu?.hidePopover();
				}}
			>
				<GearIcon class="size-5 shrink-0" aria-hidden="true" />
				Settings
			</a>
		</li>
		<li>
			<button class="min-h-11 gap-2.5 font-bold" type="button" onclick={logout}>
				<SignOutIcon class="size-5 shrink-0" aria-hidden="true" />
				Sign out
			</button>
		</li>
	</ul>
</div>
