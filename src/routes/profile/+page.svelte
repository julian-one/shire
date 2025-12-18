<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="min-h-screen bg-gray-100">
	<div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h2 class="text-3xl font-bold text-gray-900">Profile</h2>
			<p class="mt-2 text-gray-600">Your account information</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<dl class="space-y-4">
				<div>
					<dt class="text-sm font-medium text-gray-500">User ID</dt>
					<dd class="mt-1 text-lg text-gray-900">{data.user?.user_id}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Username</dt>
					<dd class="mt-1 text-lg text-gray-900">{data.user?.username}</dd>
				</div>
				<div>
					<dt class="text-sm font-medium text-gray-500">Email</dt>
					<dd class="mt-1 text-lg text-gray-900">{data.user?.email}</dd>
				</div>
			</dl>
		</div>
	</div>
</div>
