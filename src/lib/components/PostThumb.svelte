<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';
	import PostFull from './PostFull.svelte';
	import Sticker from './Sticker.svelte';
	import CaptionSticker from './CaptionSticker.svelte';
	import { onDestroy } from 'svelte';
	import { postTilt } from '$lib/utils/media';

	export let post: Post;

	let showLightbox = false;

	function handleClick() {
		showLightbox = true;
	}

	// Keep the wall from scrolling underneath while a post is open.
	$: if (typeof document !== 'undefined') document.body.style.overflow = showLightbox ? 'hidden' : '';
	onDestroy(() => {
		if (showLightbox) document.body.style.overflow = '';
	});

	function closeLightbox() {
		showLightbox = false;
	}

	const tilt = postTilt(post.id);
</script>

<button
	class="group relative !aspect-square min-h-0 overflow-hidden border-b border-r p-1 hover:bg-black hover:text-white"
	on:click={handleClick}
>

	{#if post.media}
		<!-- A light film grain on top; on hover the photo turns into an inverted black and white photocopy. -->
		<div class="grain relative w-fit" class:invisible={showLightbox}>
			<PostMedia
				media={post.media}
				class="block aspect-square object-cover group-hover:[filter:url(#xerox-bw)_invert(1)]"
			/>

			{#if post.message}
				<CaptionSticker
					mediaId={post.media.id}
					message={post.message}
					{tilt}
					maxLines={2}
					size="sm"
					raised
				/>
			{/if}

			<!-- Who posted it, at the bottom center of the photo (under the caption) -->
			<div class="absolute inset-x-0 bottom-3 z-20 flex justify-center px-3">
				<Sticker size="sm" tilt={-tilt - 1}>{post.nickname}</Sticker>
			</div>
		</div>
	{:else if post.message}
		<!-- The message, with who posted it right underneath. The tile never grows: a long message runs off the bottom
		     of the tile (starting from the top instead of centered), and the author sticks to the bottom on top of it. -->
		<div
			class="flex h-full flex-col items-center [justify-content:safe_center] gap-1 overflow-hidden p-2 md:gap-2 md:p-4"
			class:invisible={showLightbox}
		>
			<div class="max-w-full shrink-0 text-center leading-none" style="transform: rotate({tilt}deg);">
				<Sticker wrap size="sm">{post.message}</Sticker>
			</div>
			<div class="sticky bottom-0 z-10 shrink-0">
				<Sticker size="sm" tilt={-tilt - 1}>{post.nickname}</Sticker>
			</div>
		</div>
	{/if}
</button>

{#if showLightbox}
	<!-- Covers the whole screen in white so the wall behind can't be tapped; tapping anywhere closes it.
	     While open, this post's own tile on the wall is left blank (see `invisible` above). -->
	<button
		class="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-white p-4 focus:outline-none"
		aria-label="Close post"
		on:click={closeLightbox}
	>
		<PostFull {post} />
	</button>
{/if}

<style lang="postcss">
</style>
