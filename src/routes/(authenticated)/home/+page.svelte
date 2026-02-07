<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	afterNavigate(() => {
		window.scrollTo(0, document.body.scrollHeight);
	});
</script>

<div
	class="hero min-h-screen"
	style="background-image: url('/images/shire.png')"
>
	<div class="hero-overlay"></div>
	<div class="hero-content text-neutral-content flex h-full w-full flex-col items-start justify-end text-start">
		<div class="max-w-full p-4 pb-8 md:max-w-2xl lg:max-w-3xl">
			<h1 class="mb-5 text-xl leading-tight font-bold md:text-2xl lg:text-3xl">
				<i>If more of us valued food and cheer and song above hoarded gold, it would be a merrier world.</i>
			</h1>
		</div>
	</div>
</div>
