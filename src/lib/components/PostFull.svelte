<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';
	import Sticker from './Sticker.svelte';
	import CaptionSticker from './CaptionSticker.svelte';
	import { postTilt } from '$lib/utils/media';

	export let post: Post;

	const tilt = postTilt(post.id);

	function formatDate(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			month: 'short', // Use 'short' for abbreviated month
			day: 'numeric'
		};

		// Get the time in 24-hour format (e.g., 17:34)
		const time = date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});

		// Get the month and day part
		const monthDay = date.toLocaleDateString('en-US', options);

		// Get the short year manually
		const shortYear = date.getFullYear().toString().slice(-2);

		return `${time} - ${monthDay} ${shortYear}`;
	}
</script>

<!-- The expanded post looks like its wall tile, just bigger: the photo at its own aspect ratio, as large as the
     screen allows, with the caption stuck on; or a text post as one big sticker. Author and date go underneath. -->
<div class="flex flex-col items-center gap-3">
	{#if post.media}
		<div class="grain relative inline-block">
			<PostMedia
				media={post.media}
				class="block max-h-[calc(100vh-7rem)] max-w-[calc(100vw-2rem)] object-contain"
			/>
			{#if post.message}
				<CaptionSticker mediaId={post.media.id} message={post.message} {tilt} size="sm" />
			{/if}
		</div>
	{:else if post.message}
		<div class="max-w-2xl text-center leading-none" style="transform: rotate({tilt}deg);">
			<Sticker wrap size="sm">{post.message}</Sticker>
		</div>
	{/if}

	<div class="flex flex-wrap justify-center gap-3">
		<Sticker size="sm" tilt={-tilt - 1}>{post.nickname}</Sticker>
		<Sticker size="sm" tilt={tilt + 1}>{formatDate(post.date)}</Sticker>
	</div>
</div>
