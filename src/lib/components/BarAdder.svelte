<script lang="ts">
	import { PUBLIC_GOOGLE_PLACES_API_KEY } from '$env/static/public';
	import { onMount, tick } from 'svelte';
	import { loadGooglePlacesLibrary } from './loader';
	import BarRow, { type BarRowData } from '$lib/components/BarRow.svelte';
	import BarTable from '$lib/components/BarTable.svelte';
	import { formatAddress } from '$lib/utils/addressUtils';
	import { distanceLabel } from '$lib/utils/geoUtils';
	import type { LatLng } from '$lib/utils/userLocation';
	import type { KnownPlaces } from '$lib/database.types';

	export let addEndpoint: string;
	export let query: string;
	export let userLocation: LatLng | null = null;
	export let isApproximate = false;
	export let maxActivity = 0;

	const sticker = 'tap to add to bathwall';
	const armedSticker = 'tap again';
	const addingSticker = 'adding...';
	const disarmAfterMs = 4000;

	// Adding takes two taps on the same row: the first arms it, the second adds it.
	let armedKey: string | null = null;
	let addingKey: string | null = null;
	let disarmTimer: ReturnType<typeof setTimeout>;
	let form: HTMLFormElement;

	const types = ['bar', 'night_club', 'cafe'];
	const debounceMs = 300;

	let ready = false;
	let loading = false;
	let failed = false;
	let predictions: google.maps.places.AutocompletePrediction[] = [];
	// Results that are already on the wall, matched exactly by Google place id.
	let known: KnownPlaces = {};

	let autocompleteService: google.maps.places.AutocompleteService;
	let placesService: google.maps.places.PlacesService;
	// Groups the autocomplete requests and the final details lookup into one billed session.
	let sessionToken: google.maps.places.AutocompleteSessionToken;

	let selected = {
		shortName: '',
		address: '',
		placeId: '',
		location: '', // e.g. New York, Brooklyn, Thessaloniki, Athina -- used for url creation
		lat: '',
		lng: ''
	};

	onMount(() => {
		// Google calls this (instead of our callbacks) when the key is rejected, e.g. billing disabled.
		(window as any).gm_authFailure = () => {
			loading = false;
			failed = true;
		};

		loadGooglePlacesLibrary(PUBLIC_GOOGLE_PLACES_API_KEY, () => {
			autocompleteService = new google.maps.places.AutocompleteService();
			placesService = new google.maps.places.PlacesService(document.createElement('div'));
			sessionToken = new google.maps.places.AutocompleteSessionToken();
			ready = true;
		});
	});

	let timer: ReturnType<typeof setTimeout>;
	let latestRequest = 0;

	$: if (ready) search(query);

	function search(input: string) {
		clearTimeout(timer);
		const trimmed = input.trim();

		if (!trimmed) {
			predictions = [];
			known = {};
			loading = false;
			return;
		}

		loading = true;
		timer = setTimeout(() => {
			const requestId = ++latestRequest;
			// With an origin, Google includes each result's `distance_meters`.
			autocompleteService.getPlacePredictions(
				{ input: trimmed, types, sessionToken, origin: userLocation ?? undefined },
				async (results, status) => {
					// Ignore responses for queries the user has already typed past.
					if (requestId !== latestRequest) return;

					const { OK, ZERO_RESULTS } = google.maps.places.PlacesServiceStatus;
					const found = (status === OK && results) || [];
					// Look up which results we already have before showing any, so rows don't flip after appearing.
					const knownFound = await lookUpKnownPlaces(found.map((p) => p.place_id));
					if (requestId !== latestRequest) return;

					loading = false;
					failed = status !== OK && status !== ZERO_RESULTS;
					predictions = found;
					known = knownFound;
				}
			);
		}, debounceMs);
	}

	async function lookUpKnownPlaces(placeIds: string[]): Promise<KnownPlaces> {
		if (placeIds.length === 0) return {};
		try {
			const response = await fetch(`/api/known-places?ids=${placeIds.map(encodeURIComponent).join(',')}`);
			return response.ok ? await response.json() : {};
		} catch {
			return {}; // worst case they show as addable, and createBar still redirects to the existing bar
		}
	}

	// Shape Google's predictions like bars on the wall so they render with the same BarRow.
	// Ones we already have render exactly like wall bars: our name and address, a link, and activity.
	$: rows = predictions.map((prediction): BarRowData => {
		const meters = prediction.distance_meters;
		const distance = typeof meters === 'number' ? distanceLabel(meters / 1000, isApproximate) : '';
		const bar = known[prediction.place_id];

		if (bar) {
			return {
				key: prediction.place_id,
				name: bar.name,
				...formatAddress(bar.address),
				distance,
				activity: bar.postCount,
				href: `/bars/${bar.uniqueName}`
			};
		}

		return {
			key: prediction.place_id,
			name: prediction.structured_formatting.main_text,
			...formatAddress(prediction.structured_formatting.secondary_text ?? ''),
			distance,
			activity: null,
			sticker:
				prediction.place_id === addingKey
					? addingSticker
					: prediction.place_id === armedKey
						? armedSticker
						: sticker,
			armed: prediction.place_id === armedKey || prediction.place_id === addingKey
		};
	});

	function chooseRow(row: BarRowData) {
		if (addingKey) return;
		clearTimeout(disarmTimer);

		if (armedKey !== row.key) {
			armedKey = row.key;
			disarmTimer = setTimeout(() => (armedKey = null), disarmAfterMs);
			return;
		}

		const prediction = predictions.find((p) => p.place_id === row.key);
		if (!prediction) return;
		armedKey = null;
		addingKey = row.key;
		choose(prediction);
	}

	function choose(prediction: google.maps.places.AutocompletePrediction) {
		placesService.getDetails(
			{
				placeId: prediction.place_id,
				fields: ['name', 'formatted_address', 'geometry', 'address_components', 'place_id'],
				sessionToken
			},
			(place, status) => {
				// A session ends with the details call, so start a fresh one for any further searching.
				sessionToken = new google.maps.places.AutocompleteSessionToken();

				const location = place?.geometry?.location;
				if (status !== google.maps.places.PlacesServiceStatus.OK || !place || !location) {
					addingKey = null;
					failed = true;
					return;
				}

				selected = {
					shortName: place.name || prediction.structured_formatting.main_text,
					address: place.formatted_address || '',
					placeId: place.place_id || prediction.place_id,
					location: locationFrom(place.address_components),
					lat: location.lat().toString(),
					lng: location.lng().toString()
				};
				// Let the hidden inputs pick up the new values, then post to createBar (which redirects to the new wall).
				tick().then(() => form.requestSubmit());
			}
		);
	}

	function locationFrom(components: google.maps.GeocoderAddressComponent[] = []) {
		const priorityTypes = ['locality', 'sublocality_level_1', 'administrative_area_level_1', 'country'];

		for (const type of priorityTypes) {
			const found = components.find((component) => component.types.includes(type));
			if (found) return found.short_name;
		}
		return '';
	}
</script>

<div class="flex w-full flex-col">
	{#if failed}
		<p class="px-2 py-3 text-base text-gray-400">couldn't reach google right now. try again in a bit.</p>
	{:else if predictions.length > 0}
		<BarTable>
			{#each rows as row (row.key)}
				<BarRow {row} {maxActivity} on:select={(event) => chooseRow(event.detail)} />
			{/each}
		</BarTable>
	{:else if loading || !ready}
		<p class="px-2 py-3 text-base text-gray-400">searching...</p>
	{:else if query.trim()}
		<p class="px-2 py-3 text-base text-gray-400">nothing found for "{query.trim()}"</p>
	{/if}
</div>

<form action={addEndpoint} method="POST" bind:this={form}>
	<input hidden name="longName" value={selected.shortName} />
	<input hidden name="shortName" value={selected.shortName} />
	<input hidden name="address" value={selected.address} />
	<input hidden name="googlePlaceId" value={selected.placeId} />
	<input hidden name="location" value={selected.location} />
	<input hidden name="lat" value={selected.lat} />
	<input hidden name="lng" value={selected.lng} />
</form>
