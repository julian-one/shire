<script lang="ts">
	import { resume } from '$lib/data/resume';
</script>

<svelte:head>
	<title>Education | {resume.name}</title>
	<meta name="description" content="Education background of {resume.name}" />
</svelte:head>

<section class="py-12 sm:py-16 px-4 bg-base-200">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Education</h1>
		<div class="space-y-4">
			{#each resume.education as edu}
				<div class="card bg-base-100 shadow-md">
					<div class="card-body p-4 sm:py-4 sm:px-6">
						<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
							<div>
								<h3 class="font-bold text-base sm:text-lg">{edu.degree}</h3>
								<p class="text-primary text-sm sm:text-base">{edu.school}</p>
							</div>
							<span class="badge badge-outline self-start sm:self-auto">{edu.period}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
