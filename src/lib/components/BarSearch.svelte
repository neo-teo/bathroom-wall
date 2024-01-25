<script lang="ts">
	// @ts-ignore
	import GooglePlacesAutocomplete from '@silintl/svelte-google-places-autocomplete';
	import type { Bar } from '@prisma/client';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';

	export let currentBars: Bar[];

	const searchableBars = currentBars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());

	const onPlaceChanged = (ev: { detail: { place: any } }) => {
		const place = ev.detail.place;
		console.log(place);
	};

	const options = {
		types: ['bar', 'cafe'],
		fields: ['formatted_address', 'name', 'geometry']
	};
</script>

<!-- <GooglePlacesAutocomplete
	apiKey={'AIzaSyCk6LkUMc1T86hCKKO-t35kXC_QQlTpvLQ'}
	on:place_changed={onPlaceChanged}
	{options}
	placeholder="hello there"
	bind:value={$searchStore.search}
/> -->

<form class="flex flex-col">
	<input
		placeholder="bar name, city, address... yahooo"
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
