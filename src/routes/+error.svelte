<script>
	import { page } from '$app/state';

	let title = '';

	if (page.status === 404) {
		title = 'The page you are looking for does not exist.';
	} else {
		title = 'Something went wrong.';
	}
</script>

<section
	class="section animate-fade-in absolute bottom-0 left-0 flex w-full flex-col bg-white pt-8 pb-24 delay-300 duration-700 lg:bottom-1/2 lg:translate-y-1/2 lg:bg-transparent lg:pt-12 lg:pb-0"
>
	<div class="container mx-auto flex flex-col gap-2 px-8 lg:mx-auto lg:w-128.75">
		<div class="flex flex-col gap-2 lg:gap-4">
			<h1 class="text-center text-2xl font-bold text-gray-500 lg:text-5xl">{title}</h1>
			<p class="text-center text-sm leading-4 text-gray-400 lg:text-base"> oops </p>
		</div>
	</div>
</section>
