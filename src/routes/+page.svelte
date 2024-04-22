<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	import BarAdder from '$lib/components/BarAdder.svelte';
	import ActivityIndicator from '$lib/components/ActivityIndicator.svelte';
	import ActivityIndicatorLegend from '$lib/components/ActivityIndicatorLegend.svelte';
	import WallContainer from '$lib/components/WallContainer.svelte';
	import BarSortCriteria from '$lib/components/BarSortCriteria.svelte';

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

<div class="flex flex-col gap-2">
	<a href="/" class="px-5"><h1>bathroom <br /> wall</h1></a>

	<p class="px-5">
		share thoughts with others at a specific spot <br /> (leave your mark on the bathroom wall)
	</p>
</div>

<div class="mt-2 flex flex-col gap-2">
	<BarSortCriteria />

	<div class="mx-5 flex flex-col">
		<input
			placeholder="search bars by name or address..."
			type="text"
			bind:value={$searchStore.search}
		/>
	</div>
</div>

<WallContainer>
	<div class="flex flex-col gap-4 px-5">
		{#if $searchStore.filtered.length === 0}
			<!-- if there aren't any items, let the user know they can add one -->
			<div class="flex flex-wrap gap-[5px]">
				<p class="whitespace-nowrap">Don't see the bar you're looking for? Try</p>
				<button class="text-blue-400" on:click={() => (adding = true)}>adding</button>
				<p class="whitespace-nowrap">a spot.</p>
			</div>
		{:else}
			{#each $searchStore.filtered.slice(0, 20) as bar}
				<a href={`/bars/${bar.uniqueName}`}>
					<div class="flex flex-col gap-1 border-b border-dashed border-gray-400 pb-4">
						<div class="flex items-center justify-between">
							<h3>{bar.name}</h3>
							<ActivityIndicator value={bar.posts.length} maxValue={maxPosts} />
						</div>
						<p class="text-sm">{bar.address}</p>
					</div>
				</a>
			{/each}
			{#if $searchStore.filtered.length - 20 > 0}
				<p class="text-sm text-gray-400">
					and {$searchStore.filtered.length - 20} more
				</p>
			{/if}
		{/if}

		{#if $searchStore.filtered.length === 0 && adding}
			<BarAdder addEndpoint={'?/createBar'} />
		{/if}
	</div>
</WallContainer>

<!-- This div gives a little space above the activity indicator bc of the flexbox we're in -->
<div />

<ActivityIndicatorLegend />
