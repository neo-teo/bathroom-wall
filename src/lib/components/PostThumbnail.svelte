<script lang="ts">
	import type { Post } from '$lib/database.types';
	import { onMount } from 'svelte';

	export let post: Post;

	let loading = true;

	onMount(() => {
		if (post.media) {
			const img = new Image();
			setTimeout(
				() => (img.src = `https://res.cloudinary.com/dlub8oz6b/image/upload/${post.media?.id}`),
				2000
			);
			loading = true;

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
	<div class="relative aspect-square rounded-sm">
		{#if loading}
			<div
				class="absolute inset-0 flex animate-pulse items-center justify-center rounded-sm bg-gray-200"
			></div>
		{/if}
		<img
			class="aspect-square rounded-sm object-cover"
			src={`https://res.cloudinary.com/dlub8oz6b/image/upload/${post.media.id}`}
			alt={post.media.id}
			on:load={() => (loading = false)}
		/>
	</div>
{:else}
	<div class="flex flex-col gap-2">
		<div>{post.message}</div>
	</div>
{/if}
