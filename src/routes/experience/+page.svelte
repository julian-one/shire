<script lang="ts">
	import { resume } from '$lib/data/resume';
</script>

<svelte:head>
	<title>Experience | {resume.name}</title>
	<meta name="description" content="Work experience of {resume.name}" />
</svelte:head>

<section class="py-12 sm:py-16 px-4">
	<div class="max-w-3xl mx-auto">
		<h1 class="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Experience</h1>
		<div class="space-y-4 sm:space-y-6">
			{#each resume.experience as job}
				<div class="card bg-base-100 shadow-md">
					<div class="card-body p-4 sm:p-6">
						<div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
							<div>
								<h3 class="card-title text-lg sm:text-xl">{job.role}</h3>
								<p class="text-primary font-medium text-sm sm:text-base">{job.company}</p>
								<p class="text-xs sm:text-sm opacity-70">{job.location}</p>
							</div>
							<span class="badge badge-outline self-start sm:self-auto whitespace-nowrap">{job.period}</span>
						</div>
						<p class="mt-3 opacity-80 text-sm sm:text-base">{job.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
