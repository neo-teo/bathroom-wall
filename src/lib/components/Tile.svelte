<script lang="ts">
	import type { Post } from '$lib/database.types';
	import Modal from './Modal.svelte';
	import PostContent from './Post.svelte';
	import NewPostForm from './NewPostForm.svelte';
	import PostThumbnail from './PostThumbnail.svelte';

	export let data: any;
	export let form: any;

	export let row: number;
	export let col: number;
	export let post: Post | undefined = undefined;

	let showModal = false;

	function handleClick() {
		showModal = true;
	}

	let colorCss = row % 2 === col % 2 ? 'bg-white text-black' : 'bg-black text-white';

	let borderCss = `border-b border-black border-opacity-80 ${col === 3 ? '' : 'border-r'}`;
</script>

<button
	class="flex aspect-square grow cursor-pointer items-center justify-center
          {colorCss} {borderCss}"
	on:click={handleClick}
>
	{#if post}
		<div class="text-ellipsis text-sm font-bold">
			<PostThumbnail {post} />
		</div>
	{/if}
</button>

{#if showModal}
	{#if post}
		<Modal bind:showModal>
			<PostContent {post} barUniqueName="" />
		</Modal>
	{:else}
		<Modal bind:showModal>
			<NewPostForm {data} {form} {row} {col} on:submit={() => (showModal = false)} />
		</Modal>
	{/if}
{/if}

<style lang="postcss">
	.ridge {
		border-style: ridge;
	}
</style>
