<script lang="ts">
	import type { MediaFile } from '@prisma/client';
	import { onMount } from 'svelte';

	export let media: MediaFile;

	let loading = true;

	$: url = `https://res.cloudinary.com/dlub8oz6b/image/upload/${media.id}`;
	$: minDimension = 0;

	onMount(() => {
		loading = true;

		const img = new Image();
		img.src = url;

		img.onload = () => {
			loading = false;
			minDimension = Math.min(img.width, img.height);
			document.documentElement.style.setProperty('--min-dimension', `${minDimension}px`);
		};
		img.onerror = () => {
			loading = false;
		};
	});
</script>

<div class="rect-img-container">
	<img class="rect-img" src={url} alt={media.id} />
</div>

<style>
	.rect-img-container {
		/* width: 100%;
		height: 100%; */
		position: relative;
	}

	.rect-img-container::after {
		content: '';
		display: block;
		padding-bottom: 100%;
	}

	.rect-img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
