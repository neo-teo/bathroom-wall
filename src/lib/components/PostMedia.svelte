<script lang="ts">
	import type { MediaFile } from '@prisma/client';

	export let media: MediaFile;

	$: url = `https://res.cloudinary.com/dlub8oz6b/image/upload/${media.id}`;
</script>

<img src={url} alt={media.id} />
