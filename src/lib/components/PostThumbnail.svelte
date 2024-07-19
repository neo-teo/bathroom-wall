<script lang="ts">
	import type { Post } from '$lib/database.types';

	export let post: Post;
</script>

{#if post.media}
	<img
		class="aspect-square object-cover"
		src={`https://res.cloudinary.com/dlub8oz6b/image/upload/${post.media.id}`}
		alt={post.media.id}
	/>
{:else}
	<div class="flex flex-col gap-2">
		<div>{post.message}</div>
	</div>
{/if}
