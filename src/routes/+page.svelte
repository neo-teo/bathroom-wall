<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	export let data: PageData;

	const searchableBars = data.bars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>
<p>
	a shared wall of text, video, photo, and voice memo for people at a particular bar on a particular
	night
</p>

<form class="flex flex-col">
	<input
		placeholder="search current bars by name or address..."
		type="text"
		bind:value={$searchStore.search}
	/>
</form>

<div class="flex flex-col gap-[20px] border border-gray-500 bg-white p-2">
	{#each $searchStore.filtered as bar}
		<a href={`/bar/${bar.id}`}>
			<h2>{bar.name}</h2>
			<p class="text-sm">{bar.address}</p>
		</a>
	{/each}
</div>
