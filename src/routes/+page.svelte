<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	import BarAdder from '$lib/components/BarAdder.svelte';
	import ActivityIndicator from '$lib/components/ActivityIndicator.svelte';
	import ActivityIndicatorLegend from '$lib/components/ActivityIndicatorLegend.svelte';
	import BarSortCriteria from '$lib/components/BarSortCriteria.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import TileSeparator from '$lib/components/TileSeparator.svelte';

	export let data: PageData;

	$: {
		searchStore.set({
			data: data.bars.map((bar) => ({
				...bar,
				searchTerms: `${bar.name} ${bar.address}`
			})),
			filtered: $searchStore.filtered,
			search: $searchStore.search
		});
	}

	let searchableBars = data.bars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());

	$: maxPosts = Math.max(...searchableBars.map((bar) => bar.posts.length));
</script>

<Header />

<div class="grid grid-cols-[auto_120px]">
	<input
		class="border-none focus:outline-none"
		placeholder="search for a spot..."
		type="text"
		bind:value={$searchStore.search}
	/>
	<BarSortCriteria />
</div>

<TileSeparator />

<div class="flex flex-col">
	{#if $searchStore.filtered.length === 0}
		<div class="flex border-b">
			<div class="py-2 pl-2">Your spot is not on bathwall yet.</div>
			<BarAdder addEndpoint={'?/createBar'} />
		</div>
	{:else}
		{#each $searchStore.filtered.slice(0, 20) as bar, index}
			<a
				class="border-b decoration-blue-400 hover:decoration-wavy"
				href={`/bars/${bar.uniqueName}`}
			>
				<div class="flex flex-col gap-1 px-2 py-3 no-underline">
					<h3 class="font-medium">{bar.name}</h3>

					<p class="text-sm">{bar.address}</p>
				</div>
			</a>

			<!-- <ActivityIndicator value={bar.posts.length} maxValue={maxPosts} /> -->
		{/each}

		{#if $searchStore.filtered.length - 20 > 0}
			<p class="px-5 py-2 text-sm text-gray-400">
				and {$searchStore.filtered.length - 20} more
			</p>
		{/if}
	{/if}
</div>

<TileSeparator />

<ActivityIndicatorLegend />
