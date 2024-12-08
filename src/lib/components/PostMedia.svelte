<script lang="ts">
	import type { MediaFile } from '@prisma/client';
	import { onMount } from 'svelte';

	export let media: MediaFile;

	let loading = true;

	$: url = `https://res.cloudinary.com/dlub8oz6b/image/upload/${media.id}`;

	onMount(() => {
		loading = true;

		const img = new Image();
		img.src = `https://res.cloudinary.com/dlub8oz6b/image/upload/${media.id}`;

		img.onload = () => {
			loading = false;
		};
		img.onerror = () => {
			loading = false;
		};
	});
</script>

<img class="object-fit" src={url} alt={media.id} />
