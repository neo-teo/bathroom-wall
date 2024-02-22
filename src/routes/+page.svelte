<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	import BarAdder from '$lib/components/BarAdder.svelte';
	import Icon from '@iconify/svelte';

	export let data: PageData;

	const searchableBars = data.bars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());

	let adding = false;
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>
<p>a shared wall of text and image for people at a particular place on a particular day</p>

<div class="mt-[10px] flex flex-col gap-[5px]">
	{#if data.clientCity}
		<div class="flex justify-between">
			<div class="flex items-center gap-[5px]">
				<select name="clientCity" class="dropdown relative w-fit bg-transparent text-sm font-bold">
					<option value={data.clientCity}>{data.clientCity}</option>
				</select>
				<Icon icon="octicon:triangle-down" />
			</div>
			<div class="flex items-center gap-[5px]">
				<select
					name="sortCriteria"
					class="dropdown relative w-fit bg-transparent text-sm font-bold"
				>
					<option value={'Hottest'}>Hottest</option>
					<option value={'Closest'}>Closest</option>
				</select>
				<Icon icon="octicon:triangle-down" />
			</div>
		</div>
	{/if}
	<input
		placeholder="search bars by name or address..."
		type="text"
		bind:value={$searchStore.search}
	/>
</div>

<div class="flex flex-col gap-[20px] border border-gray-500 bg-white p-2">
	{#if $searchStore.filtered.length === 0}
		<!-- if there aren't any items, let the user know they can add one -->
		<div class="flex flex-wrap gap-[5px]">
			<p class="whitespace-nowrap">Don't see the bar you're looking for? Try</p>
			<button class="text-blue-400" on:click={() => (adding = true)}>adding</button>
			<p class="whitespace-nowrap">a spot.</p>
		</div>
	{:else}
		{#each $searchStore.filtered
			.sort((a, b) => b.posts.length - a.posts.length)
			.slice(0, 20) as bar}
			<div class="flex flex-col gap-[5px]">
				<div class="flex items-center justify-between">
					<a href={`/bars/${bar.id}`}>
						<h2>{bar.name}</h2>
					</a>
					<p class="text-sm text-gray-400">{bar.posts.length} tags</p>
				</div>
				<p class="text-sm">{bar.address}</p>
			</div>
		{/each}
		{#if $searchStore.filtered.length - 20 > 0}
			<p class="text-sm text-gray-400">
				and {$searchStore.filtered.length - 20} more
			</p>
		{/if}
	{/if}
</div>

{#if $searchStore.filtered.length === 0 && adding}
	<BarAdder addEndpoint={'?/createBar'} />
{/if}

<!-- css to expand clickable area of voteButtons without affecting their size visually -->
<style lang="postcss">
	.dropdown {
		-webkit-appearance: none;
	}
	.dropdown::after {
		content: '';
		position: absolute;
		top: -20px;
		left: -20px;
		right: -60px;
		bottom: -20px;
	}
</style>
