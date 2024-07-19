<script lang="ts">
	import PostMedia from './PostMedia.svelte';
	import type { Post } from '$lib/database.types';
	import PostShare from './PostShare.svelte';

	export let barUniqueName: string;
	export let post: Post;
</script>

<div id={`post_${post.id}`} class="transition duration-1000">
	<div class="flex flex-col gap-5">
		<p class="px-5">{post.message}</p>

		{#if post.media}
			<PostMedia media={post.media} />
		{/if}

		<div class="flex justify-between px-5">
			<div class="flex gap-[3px]">
				by: <p class="font-bold">{post.nickname}</p>
			</div>
			<PostShare {post} {barUniqueName} />
		</div>
	</div>
</div>
