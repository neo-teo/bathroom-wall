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
</script>

<button
	class="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-black
          {row % 2 === col % 2 ? 'bg-gray-900 text-white' : 'bg-white text-black'}"
	on:click={handleClick}
>
	{#if post}
		<div class="text-ellipsis p-1 text-xs">
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
		<NewPostForm {data} {form} {row} {col} />
	{/if}
{/if}
