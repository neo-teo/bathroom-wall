<script lang="ts">
	import type { Post } from '$lib/database.types';
	import { onMount } from 'svelte';

	export let post: Post;

	let loading = true;

	onMount(() => {
		if (post.media) {
			loading = true;

			const img = new Image();
			img.src = `https://res.cloudinary.com/dlub8oz6b/image/upload/${post.media?.id}`;

			img.onload = () => {
				loading = false;
			};
			img.onerror = () => {
				loading = false;
			};
		}
	});
</script>

{#if post.media}
	<div class="relative aspect-square">
		{#if loading}
			<div
				class="absolute inset-0 flex animate-pulse items-center justify-center rounded-sm bg-gray-200"
			></div>
		{/if}
		<img
			class="aspect-square object-cover"
			src={`https://res.cloudinary.com/dlub8oz6b/image/upload/${post.media.id}`}
			alt={post.media.id}
			on:load={() => (loading = false)}
		/>
	</div>
{:else}
	<div class="line-clamp-3 px-2">
		<div>{post.message}</div>
	</div>
{/if}
