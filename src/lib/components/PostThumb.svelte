<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';
	import PostFull from './PostFull.svelte';

	export let post: Post;

	let showLightbox = false;

	function handleClick() {
		showLightbox = true;
	}

	function closeLightbox() {
		showLightbox = false;
	}

	const rotation = 16 * Math.random() - 8;
</script>

<button
	class="group !aspect-square border-b border-r p-1 hover:bg-black hover:text-white"
	on:click={handleClick}
>
	{#if post.media}
		<!-- A light film grain on top; on hover the photo turns into an inverted black and white photocopy. -->
		<div class="grain relative w-fit">
			<PostMedia
				media={post.media}
				class="block aspect-square object-cover group-hover:[filter:url(#xerox-bw)_invert(1)]"
			/>
		</div>
	{:else if post.message}
		<div class={'line-clamp-6 h-full p-4 text-left text-xl'}>
			{post.message}
		</div>
	{/if}
</button>

{#if showLightbox}
	<button
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
		on:click={closeLightbox}
	>
		<div class="max-h-full max-w-full overflow-auto">
			<PostFull {post} />
		</div>
	</button>
{/if}

<style lang="postcss">
</style>
