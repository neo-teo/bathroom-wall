<script lang="ts">
	import { howLongAgo } from '$lib/utils/timeUtils';
	import PostMedia from './PostMedia.svelte';
	import type { Post } from '$lib/database.types';
	import Cookies from 'js-cookie';
	import Icon from '@iconify/svelte';

	export let post: Post;

	$: vote = Cookies.get(post.id) ?? '';

	// newVote will be strictly 'u' or 'd'
	async function voted(newVote: string) {
		let change = vote === '' ? 1 : vote === newVote ? -1 : 2;

		if (newVote === 'd') change *= -1;

		post.score = post.score + change;

		vote = vote === newVote ? '' : newVote;
		Cookies.set(post.id, vote);

		await fetch(`/api/posts/${post.id}/score`, {
			method: 'PATCH',
			body: JSON.stringify({ change: change })
		});
	}

	function share() {
		if (navigator.share) {
			navigator.share({
				text: `check out this bathroom wall tag by: ${post.nickname}`,
				url: `https://bathwall.xyz/bars/${post.barId}`
			});
		} else {
			navigator.clipboard.writeText(`https://bathwall.xyz/bars/${post.barId}`);
			// TODO: show copied to clipboard somewhere
		}
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

		<div class="flex justify-between">
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
			<button on:click={share}>
				<Icon icon="mdi:share" color={'lightgray'} />
			</button>
		</div>
	</div>
</div>
