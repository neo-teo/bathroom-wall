<script lang="ts">
	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const searchableBars = data.bars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address} ${bar.city} ${bar.zipCode}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>
<p>
	a shared wall of text, video, photo, and voice memos for people at a particular bar on a
	particular night
</p>

<form class="flex flex-col">
	<input type="text" placeholder="bar name, city, address..." bind:value={$searchStore.search} />
</form>

<div class="flex flex-col gap-[20px] border border-gray-500 bg-white p-2">
	{#each $searchStore.filtered as bar}
		<a href={`/bar/${bar.id}`}>
			<h2>{bar.name}</h2>
			<p class="text-sm">{bar.address}, {bar.city} {bar.zipCode}</p>
		</a>
	{/each}
</div>
