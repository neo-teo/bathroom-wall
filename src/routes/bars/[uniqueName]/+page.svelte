<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import Tile from '$lib/components/Tile.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import TileSeparator from '$lib/components/TileSeparator.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import NewPostForm from '$lib/components/NewPostForm.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: posts = data.bar.posts;

	let showModal = false;

	function showNewTagForm() {
		showModal = true;
	}
</script>

<Header barName={data.bar.name} />

<div class={`grid w-full grid-cols-2 self-center md:grid-cols-3 xl:grid-cols-4`}>
	<button
		class="border-b border-r bg-gray-50 text-3xl font-thin text-gray-500"
		on:click={showNewTagForm}
	>
		+
	</button>
	<Modal bind:showModal>
		<NewPostForm
			{data}
			{form}
			on:submit={() => {
				console.log('submitting form');
				showModal = false;
			}}
		/>
	</Modal>

	{#each posts as post}
		<Tile {post} />
	{/each}
</div>

<TileSeparator />
