<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import PostMedia from './PostMedia.svelte';
	import type { Post } from '$lib/database.types';
	import PostShare from './PostShare.svelte';
	import PostVotes from './PostVotes.svelte';

	export let post: Post;
</script>

<div
	id={`post_${post.id}`}
	class="flex flex-col gap-[10px] rounded-sm border border-gray-500 bg-white p-3 transition duration-1000"
>
	<div class="flex justify-between">
		<div class="flex gap-[3px]">
			#
			<p class="font-bold">{post.nickname}</p>
		</div>
		<p class="text-sm text-gray-400">{howLongAgo(post.date)}</p>
	</div>

	<p>{post.message}</p>

	{#if post.media}
		<PostMedia media={post.media} />
	{/if}

	<div class="flex justify-between">
		<PostVotes {post} />
		<PostShare {post} />
	</div>
</div>
