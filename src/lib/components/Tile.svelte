<script lang="ts">
	import type { Post } from '$lib/database.types';
	import Modal from './Modal.svelte';
	import NewPostForm from './NewPostForm.svelte';
	import Tag from './Tag.svelte';

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

<button class="border-b border-r" on:click={handleClick}>
	{#if post}
		<Tag {post} />
	{/if}
</button>

{#if showModal}
	{#if post}
		<Modal bind:showModal>
			<div class="">
				<Tag {post} />
			</div>
		</Modal>
	{:else}
		<Modal bind:showModal>
			<NewPostForm {data} {form} {row} {col} on:submit={() => (showModal = false)} />
		</Modal>
	{/if}
{/if}

<style lang="postcss">
</style>
