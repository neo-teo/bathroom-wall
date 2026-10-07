<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { distanceLabel, haversine } from '$lib/utils/geoUtils';
	import { formatAddress } from '$lib/utils/addressUtils';
	import { getLocationWithoutPrompt, type LatLng } from '$lib/utils/userLocation';

	import BarAdder from '$lib/components/BarAdder.svelte';
	import BarRow, { type BarRowData } from '$lib/components/BarRow.svelte';
	import BarTable from '$lib/components/BarTable.svelte';
	import BarSortCriteria from '$lib/components/BarSortCriteria.svelte';
	import Header from '$lib/components/Header.svelte';
	import TileSeparator from '$lib/components/TileSeparator.svelte';

	export let data: PageData;

	type ListBar = PageData['bars'][number];

	// The first page comes from the server; "load more" appends further pages from /api/bars.
	let bars: ListBar[] = data.bars;
	let nextOffset = data.nextOffset;
	let loadingMore = false;

	// Start over whenever the server data changes, e.g. switching between "Close" and "Active".
	$: resetList(data);

	function resetList(fresh: PageData) {
		bars = fresh.bars;
		nextOffset = fresh.nextOffset;
	}

	async function loadMore() {
		if (nextOffset === null || loadingMore) return;
		loadingMore = true;

		try {
			const params = new URLSearchParams({ offset: String(nextOffset) });
			const lat = $page.url.searchParams.get('lat');
			const lng = $page.url.searchParams.get('lng');
			if (lat && lng) {
				params.set('lat', lat);
				params.set('lng', lng);
			}

			const response = await fetch(`/api/bars?${params}`);
			const more = await response.json();
			bars = [...bars, ...more.bars];
			nextOffset = more.nextOffset;
		} finally {
			loadingMore = false;
		}
	}

	const searchStore = createSearchStore<ListBar & { searchTerms: string }>([]);

	$: searchStore.update((model) => ({
		...model,
		data: bars.map((bar) => ({ ...bar, searchTerms: `${bar.name} ${bar.address}` }))
	}));

	$: filtered = searchHandler($searchStore).filtered;

	// Prefer the location in the url ("Close" sort), else one cached by BarSortCriteria in the last hour,
	// else ask the browser if the visitor has already granted location access (no prompt),
	// else use the server's IP-based guess.
	let knownLocation: LatLng | null = null;

	onMount(async () => {
		knownLocation = (await getLocationWithoutPrompt()) ?? knownLocation;
	});

	$: urlLat = $page.url.searchParams.get('lat');
	$: urlLng = $page.url.searchParams.get('lng');
	// Keep the url location around so switching back to "Active" still shows distances.
	$: if (urlLat && urlLng) knownLocation = { lat: parseFloat(urlLat), lng: parseFloat(urlLng) };
	// Fall back to the IP-based guess from the server, shown with a "~" since it's only city level.
	$: userLocation = knownLocation ?? data.approximateLocation;
	$: isApproximate = !knownLocation && !!data.approximateLocation;

	function toRow(
		bar: ListBar,
		from: LatLng | null,
		isApproximate: boolean
	): BarRowData {
		const km =
			from && bar.lat && bar.lng
				? haversine(from.lat, from.lng, parseFloat(bar.lat), parseFloat(bar.lng))
				: null;

		return {
			key: bar.id,
			name: bar.name,
			...formatAddress(bar.address),
			distance: km === null ? '' : distanceLabel(km, isApproximate),
			activity: bar.postCount,
			href: `/bars/${bar.uniqueName}`
		};
	}

	$: maxPosts = data.maxPostCount;
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
	{#if filtered.length === 0}
		<div class="flex">
			<BarAdder
				addEndpoint={'?/createBar'}
				query={$searchStore.search}
				{userLocation}
				{isApproximate}
			/>
		</div>
	{:else}
		<BarTable>
			{#each filtered as bar (bar.id)}
				<BarRow row={toRow(bar, userLocation, isApproximate)} maxActivity={maxPosts} />
			{/each}
		</BarTable>

		{#if nextOffset !== null}
			<button
				class="px-2 py-3 text-left text-gray-400 hover:text-black focus:outline-none disabled:hover:text-gray-400"
				disabled={loadingMore}
				on:click={loadMore}
			>
				{loadingMore ? 'loading...' : `load more (${data.total - bars.length} left)`}
			</button>
		{/if}
	{/if}
</div>

<TileSeparator />

<!-- <ActivityIndicatorLegend /> -->
