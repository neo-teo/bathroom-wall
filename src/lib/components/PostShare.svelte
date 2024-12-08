<script lang="ts">
	import type { Post } from '$lib/database.types';
	import Icon from '@iconify/svelte';

	export let barUniqueName: string;
	export let post: Post;

	let copied = false;

	let url = `https://bathwall.co/bars/${barUniqueName}?postId=${post.id}`;

	function share() {
		if (navigator.share) {
			navigator.share({
				text: `check out this bathwall tag by: ${post.nickname}`,
				url: url
			});
		} else {
			navigator.clipboard.writeText(url);
			copied = true;
			setTimeout(() => (copied = false), 800);
		}
	}
</script>

<div class="flex items-center gap-[5px]">
	<div class={`text-sm transition-opacity duration-150 ${copied ? '' : 'opacity-0'}`}>
		copied to clipboard
	</div>
	<button on:click={share} class="focus:outline-none">
		<Icon icon="mdi:share" color={'lightgray'} />
	</button>
</div>
