<script lang="ts">
	import type { MediaFile } from '@prisma/client';
	import { CldImage } from 'svelte-cloudinary';

	export let media: MediaFile;

	const [width, height] = media.aspectRatio.split(':');
</script>

<!-- TODO: add logic based on media.type to render video or other types -->
<CldImage src={media.id} {width} {height} />
