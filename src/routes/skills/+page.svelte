<script lang="ts">
	import { resume } from '$lib/data/resume';

	let expandedSkill: string | null = $state(null);

	function toggleSkill(skillName: string) {
		expandedSkill = expandedSkill === skillName ? null : skillName;
	}
</script>

<svelte:head>
	<title>Skills | {resume.name}</title>
	<meta name="description" content="Technical skills of {resume.name}" />
</svelte:head>

<section class="py-12 sm:py-16 px-4 bg-base-200">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Skills</h1>
		<p class="text-center text-sm opacity-60 mb-6">Click a skill to see experience breakdown</p>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Languages</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.languages as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-primary gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-primary={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Frontend</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.frontend as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-secondary gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-secondary={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Backend</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.backend as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-accent gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-accent={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Cloud</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.cloud as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-info gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-info={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Tools & Methods</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.tools as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-neutral gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-neutral={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
			<div class="card bg-base-100">
				<div class="card-body p-4 sm:p-6">
					<h3 class="card-title text-base sm:text-lg">Data & ML</h3>
					<div class="flex flex-wrap gap-2 mt-2">
						{#each resume.skills.data as skill}
							<div class="flex flex-col items-start">
								<button
									class="badge badge-warning gap-1 p-3 cursor-pointer hover:brightness-110 transition-all"
									class:ring-2={expandedSkill === skill.name}
									class:ring-warning={expandedSkill === skill.name}
									onclick={() => toggleSkill(skill.name)}
								>
									<span>{skill.name}</span>
									<span class="opacity-70 text-xs">({skill.years}y)</span>
								</button>
								{#if expandedSkill === skill.name}
									<div class="text-xs mt-1 ml-1 space-y-0.5">
										{#each skill.breakdown as b}
											<div class="opacity-70">{b.job}: {b.years}y</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
