<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	$: sortByDistance = $page.url.searchParams.has('lat') && $page.url.searchParams.has('lng');

	let geolocationError: string | undefined;

	async function getUserLocation() {
		const storedLoc = getStoredLocation();

		if (storedLoc) {
			return storedLoc;
		}

		const loc = await requestGeolocation();
		return loc;
	}

	function getStoredLocation() {
		const storedLocation = localStorage.getItem('user_location');
		if (storedLocation) {
			const { lat, lng, timestamp } = JSON.parse(storedLocation);
			// 1 hr = 60 * 60 * 1000 ms
			if (Date.now() - timestamp < 60 * 60 * 1000) {
				return { lat, lng };
			}
		}
		return null;
	}

	// TODO: move this to a geo helpers lib ..
	async function requestGeolocation() {
		if ('geolocation' in navigator) {
			try {
				const position = await new Promise<GeolocationPosition>((resolve, reject) => {
					navigator.geolocation.getCurrentPosition(resolve, reject);
				});
				const { latitude, longitude } = position.coords;

				localStorage.setItem(
					'user_location',
					JSON.stringify({ lat: latitude, lng: longitude, timestamp: Date.now() })
				);

				return { lat: latitude, lng: longitude };
			} catch (error) {
				geolocationError =
					'Unable to request location. Check location services settings for this browser.';
				console.error(error);
			}
		} else {
			geolocationError = 'This browser does not support geolocation.';
			console.error('Geolocation is not supported by this browser');
		}
	}

	onMount(() => {
		getUserLocation().then((loc) => loc && goto(`/?lat=${loc.lat}&lng=${loc.lng}`));
	});
</script>

<div class="grid grid-cols-[1fr_1fr] border-l">
	<button
		on:click={() => {
			getUserLocation().then((loc) => loc && goto(`/?lat=${loc.lat}&lng=${loc.lng}`));
		}}
		class={`p-2 ${sortByDistance ? 'bg-black text-white' : 'bg-white'}`}
	>
		Close
	</button>

	<button
		on:click={() => goto('/')}
		class={`p-2 ${sortByDistance ? 'bg-white' : 'bg-black text-white'}`}
	>
		Active
	</button>
</div>

{#if geolocationError}
	<p class="py-2 text-sm text-rose-500">{geolocationError}</p>
{/if}
