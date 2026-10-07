<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import PostThumb from '$lib/components/PostThumb.svelte';
	import Header from '$lib/components/Header.svelte';
	import TileSeparator from '$lib/components/TileSeparator.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import NewPostForm from '$lib/components/NewPostForm.svelte';
	import Sticker from '$lib/components/Sticker.svelte';

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
	<!-- Empty wall: the whole thing is one big button until the first post goes up. -->
	<button
		class="group flex h-[60vh] min-h-64 w-full flex-col items-center justify-center gap-3 border-b bg-gray-50 hover:bg-black focus:outline-none"
		on:click={showNewTagForm}
	>
		<Sticker tilt={-2}>nothing on the wall yet</Sticker>
		<Sticker size="sm" tilt={1.5}>tap to tag</Sticker>
	</button>
{:else}
	<div class={`grid w-full grid-cols-3 self-center md:grid-cols-4 xl:grid-cols-5`}>
		<button
			class="group flex items-center justify-center border-b border-r bg-gray-50 hover:bg-black focus:outline-none"
			on:click={showNewTagForm}
		>
			<Sticker size="sm" tilt={-2}>tap to tag</Sticker>
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
