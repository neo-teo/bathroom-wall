<script lang="ts">
	import type { Post } from '$lib/database.types';
	import Modal from './Modal.svelte';
	import Tag from './Tag.svelte';

	export let post: Post;

	let showModal = false;

	function handleClick() {
		showModal = true;
	}
</script>

<button class="border-b border-r" on:click={handleClick}>
	<Tag {post} />
</button>

<Modal bind:showModal>
	<Tag {post} />
</Modal>

<style lang="postcss">
</style>
