<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="hero bg-base-100 min-h-[70vh]">
	<div class="hero-content text-center">
		<div class="max-w-md">
			<h1 class="text-primary text-5xl font-bold">{page.status}</h1>
			<h2 class="mt-4 text-3xl font-black tracking-tight"
				>{page.status === 404 ? 'Page Not Found' : 'Something went wrong'}</h2
			>
			<p class="text-base-content/60 py-6">
				{page.error?.message || "We couldn't find what you were looking for."}
			</p>
			<button
				onclick={() => history.back()}
				class="btn btn-outline">Go Back</button
			>
		</div>
	</div>
</div>
