<script lang="ts">
	import type { Post } from '$lib/database.types';
	import PostMedia from './PostMedia.svelte';

	export let post: Post;

	let rotation = -(Math.random() * 4) + -(Math.random() * 4);

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
		const shortYear = `'${date.getFullYear().toString().slice(-2)}`;

		return `${time} - ${monthDay} ${shortYear}`;
	}
</script>

<div class="relative aspect-square p-2">
	<div class="flex h-full flex-col justify-between gap-1 p-1 text-left text-xs sm:text-sm">
		{#if post.message}
			<div
				class={post.media
					? 'absolute z-10 line-clamp-1 bg-white px-1'
					: 'line-clamp-6 px-1 text-3xl'}
			>
				{post.message}
			</div>
		{/if}

		{#if post.media}
			<PostMedia media={post.media} />
		{/if}

		<div class="flex items-center justify-between text-xs">
			<div class="flex gap-1">
				# <p class="px-1 italic">{post.nickname}</p>
			</div>
			<p class="italic">{formatDate(post.date)}</p>
		</div>
	</div>
</div>
