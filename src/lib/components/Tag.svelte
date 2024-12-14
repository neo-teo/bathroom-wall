<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';

	export let post: Post;

	let rotation = -(Math.random() * 4) + -(Math.random() * 4);

	// Function to format the date
	function formatDate(date: Date): string {
		const options: Intl.DateTimeFormatOptions = {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		};
		return date.toLocaleString('en-US', options).replace(',', '');
	}
</script>

<div class="relative aspect-square w-full w-screen max-w-full p-2">
	<div class="flex h-full flex-col justify-between gap-1 p-1 text-left text-xs sm:text-sm">
		{#if post.message}
			<div class={post.media ? 'line-clamp-1' : 'line-clamp-6'}>
				{post.message}
			</div>
		{/if}

		{#if post.media}
			<PostMedia media={post.media} />
		{/if}

		<div class="italic">
			{post.nickname}
			<!-- <p class="text-xs">{formatDate(post.date)}</p> -->
		</div>
	</div>
</div>
