<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="hero bg-base-100 min-h-[70vh]">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-primary text-9xl font-bold opacity-20">{page.status}</h1>
			<div class="relative -mt-16">
				<h2 class="text-3xl font-bold">{page.status === 404 ? 'Page Not Found' : 'Something went wrong'}</h2>
				<p class="text-base-content/70 py-6">
					{page.error?.message || "We couldn't find what you were looking for."}
				</p>
				<div class="flex justify-center gap-4">
					<button
						onclick={() => history.back()}
						class="btn btn-outline">Go Back</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
