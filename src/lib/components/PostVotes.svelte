<script lang="ts">
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
</script>

<div class="flex items-center gap-[5px]">
	<button class="voteButton" on:click={() => voted('u')}>
		<Icon icon="mdi:arrow-up-bold" color={vote === 'u' ? 'black' : 'lightgray'} />
	</button>
	<div class="flex w-[30px] justify-center">
		<p class={!vote ? 'text-gray-400' : ''}>{post.score}</p>
	</div>
	<button class="voteButton" on:click={() => voted('d')}>
		<Icon icon="mdi:arrow-down-bold" color={vote === 'd' ? 'black' : 'lightgray'} />
	</button>
</div>

<!-- css to expand clickable area of voteButtons without affecting their size visually -->
<style lang="postcss">
	.voteButton {
		position: relative;
	}
	.voteButton::after {
		content: '';
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
	}
</style>
