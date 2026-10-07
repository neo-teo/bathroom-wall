<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import PostThumb from '$lib/components/PostThumb.svelte';
	import Header from '$lib/components/Header.svelte';
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

{#if posts.length === 0}
	<!-- Empty wall: the whole thing is one big "+" until the first post goes up. -->
	<button
		class="h-[60vh] min-h-64 w-full border-b bg-gray-50 text-6xl font-thin text-gray-500 hover:bg-black hover:text-white focus:outline-none"
		aria-label="Add the first post"
		on:click={showNewTagForm}
	>
		+
	</button>
{:else}
	<div class={`grid w-full grid-cols-2 self-center md:grid-cols-3 xl:grid-cols-4`}>
		<button
			class="border-b border-r bg-gray-50 text-3xl font-thin text-gray-500 hover:bg-black hover:text-white focus:outline-none"
			on:click={showNewTagForm}
		>
			+
		</button>

		{#each posts as post}
			<PostThumb {post} />
		{/each}
	</div>
{/if}

<Modal bind:showModal on:closeModal={() => (showModal = false)}>
	<NewPostForm {data} {form} />
</Modal>

<TileSeparator />
