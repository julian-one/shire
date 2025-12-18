<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="min-h-screen bg-base-200 py-6 sm:py-8">
	<div class="mx-auto max-w-3xl px-4">
		<div class="mb-6 sm:mb-8">
			<h2 class="text-2xl sm:text-3xl font-bold">Profile</h2>
			<p class="mt-2 text-sm sm:text-base text-base-content/70">Your account information</p>
		</div>

		<div class="card bg-base-100 shadow-xl">
			<div class="card-body p-4 sm:p-6">
				<div class="space-y-4">
					<div>
						<div class="text-sm font-medium text-base-content/50">User ID</div>
						<div class="text-lg">{data.user?.user_id}</div>
					</div>
					<div class="divider my-0"></div>
					<div>
						<div class="text-sm font-medium text-base-content/50">Username</div>
						<div class="text-lg">{data.user?.username}</div>
					</div>
					<div class="divider my-0"></div>
					<div>
						<div class="text-sm font-medium text-base-content/50">Email</div>
						<div class="text-lg">{data.user?.email}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
