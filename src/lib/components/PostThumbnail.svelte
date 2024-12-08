<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';

	export let post: Post;

	let rotation = -(Math.random() * 4) + -(Math.random() * 4);
</script>

<div
	class="flex aspect-square h-full flex-col justify-between gap-2 p-1 text-left font-mono text-xs sm:text-sm"
>
	<div class="flex flex-col gap-2">
		{#if post.message}
			<div class={`${post.media ? 'line-clamp-1' : 'line-clamp-6'}`}>{post.message}</div>
		{/if}

		{#if post.media}
			<PostMedia media={post.media} />
		{/if}
	</div>

	<div>
		by: <b>{post.nickname}</b>
	</div>

	<!-- <div class="flex gap-[3px]">
		<p class="font-bold">{post.date}</p>
	</div> -->
</div>
