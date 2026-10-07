<script lang="ts">
	import { onMount } from 'svelte';
	import Sticker from './Sticker.svelte';
	import { bottomBrightness } from '$lib/utils/media';

	// A photo's caption, stuck on at the bottom center. Place inside a `relative` box around the image.
	export let mediaId: string;
	export let message: string;
	export let tilt = 0;
	export let maxLines: number | undefined = undefined;
	export let raised = false; // sit higher, leaving room for an author sticker underneath

	// A black sticker over light photos, a white one over dark photos.
	let tone: 'dark' | 'light' = 'dark';

	onMount(async () => {
		const brightness = await bottomBrightness(mediaId);
		if (brightness !== null) tone = brightness > 0.5 ? 'dark' : 'light';
	});
</script>

<div class="absolute inset-x-0 z-10 flex justify-center px-3" class:bottom-3={!raised} class:bottom-11={raised}>
	<div
		class="text-center leading-relaxed"
		class:line-clamp-2={maxLines === 2}
		style="transform: rotate({tilt}deg);"
	>
		<Sticker wrap {tone}>{message}</Sticker>
	</div>
</div>
