<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import PostMedia from './PostMedia.svelte';
	import type { Post } from '$lib/database.types';
	import Cookies from 'js-cookie';
	import Icon from '@iconify/svelte';

	export let post: Post;

	$: vote = Cookies.get(post.id) ?? '';

	async function voted(newVote: string) {
		let change = 0;

		// newVote will either be 'u' or 'd'
		if (newVote === 'u') {
			if (vote === 'u') change = -1;
			if (vote === 'd') change = 2;
			if (vote === '') change = 1;
		} else {
			if (vote === 'u') change = -2;
			if (vote === 'd') change = 1;
			if (vote === '') change = -1;
		}

		post.score = post.score + change;

		vote = vote === newVote ? '' : newVote;
		Cookies.set(post.id, vote);

		await fetch(`/api/posts/${post.id}/score`, {
			method: 'PATCH',
			body: JSON.stringify({ change: change })
		});
	}
</script>

<div class="flex flex-col gap-[5px]">
	<div class="flex flex-col gap-[10px] rounded-sm border border-gray-500 bg-white p-3">
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

		<div class="flex items-center gap-[5px]">
			<button on:click={() => voted('u')}>
				<Icon icon="mdi:arrow-up-bold" color={vote === 'u' ? 'black' : 'lightgray'} />
			</button>
			<div class="flex w-[30px] justify-center">
				<p class={!vote ? 'text-gray-400' : ''}>{post.score}</p>
			</div>
			<button on:click={() => voted('d')}>
				<Icon icon="mdi:arrow-down-bold" color={vote === 'd' ? 'black' : 'lightgray'} />
			</button>
		</div>
	</div>
</div>
