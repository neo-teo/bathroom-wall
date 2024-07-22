<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	import BarAdder from '$lib/components/BarAdder.svelte';
	import ActivityIndicator from '$lib/components/ActivityIndicator.svelte';
	import ActivityIndicatorLegend from '$lib/components/ActivityIndicatorLegend.svelte';
	import BarSortCriteria from '$lib/components/BarSortCriteria.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import WhiteTileRow from '$lib/components/header/WhiteTileRow.svelte';

	export let data: PageData;

	let adding = false;

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

<div class="flex flex-col">
	<Header />

	<p class="border border-black bg-white px-5 py-1 text-black">
		share thoughts with others at a specific spot <br /> (leave your mark on the bathroom wall)
	</p>
</div>

<div class="flex flex-col border-l border-r border-black">
	<BarSortCriteria />

	<div class="flex flex-col pl-3">
		<input
			class="border-none focus:outline-none"
			placeholder="search bars by name or address..."
			type="text"
			bind:value={$searchStore.search}
		/>
	</div>
</div>

<WhiteTileRow />

<div class="flex flex-col border border-black">
	{#if $searchStore.filtered.length === 0}
		<!-- if there aren't any items, let the user know they can add one -->
		<div class="flex flex-wrap gap-[5px]">
			<p class="whitespace-nowrap">Don't see the bar you're looking for? Try</p>
			<button class="text-blue-400" on:click={() => (adding = true)}>adding</button>
			<p class="whitespace-nowrap">a spot.</p>
		</div>
		{#if adding}
			<BarAdder addEndpoint={'?/createBar'} />
		{/if}
	{:else}
		<div class="grid grid-cols-[1fr_50px]">
			{#each $searchStore.filtered.slice(0, 20) as bar, index}
				<a class={`border-b border-black no-underline`} href={`/bars/${bar.uniqueName}`}>
					<div class="flex flex-col gap-1 px-5 py-3">
						<h3 class="border-black font-black">{bar.name}</h3>

						<p class="text-sm font-medium">{bar.address}</p>
					</div>
				</a>

				<div class={`} flex items-center justify-center border-b border-black`}>
					<ActivityIndicator value={bar.posts.length} maxValue={maxPosts} />
				</div>
			{/each}
		</div>
		{#if $searchStore.filtered.length - 20 > 0}
			<p class="px-5 py-2 text-sm text-gray-400">
				and {$searchStore.filtered.length - 20} more
			</p>
		{/if}
	{/if}
</div>

<WhiteTileRow />
<WhiteTileRow />

<ActivityIndicatorLegend />
