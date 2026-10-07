<script lang="ts">
	import type { MediaFile } from '@prisma/client';
	import { onMount } from 'svelte';
	import { mediaUrl } from '$lib/utils/media';

	export let media: MediaFile;

	let loading = true;

	$: url = mediaUrl(media.id);

	onMount(() => {
		loading = true;

		const img = new Image();
		img.src = url;

		img.onload = () => {
			loading = false;
		};
		img.onerror = () => {
			loading = false;
		};
	});
</script>

<img src={url} alt={media.id} {...$$restProps} />

<style>
</style>
