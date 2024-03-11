<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let sortByActivity = true;
	let geolocationError: string | undefined;

	$: {
		const lat = $page.url.searchParams.get('lat');
		const lng = $page.url.searchParams.get('lng');

		sortByActivity = !(lat && lng);
	}

	async function requestGeolocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					const { latitude, longitude } = position.coords;
					goto(`/?lat=${latitude}&lng=${longitude}`);
				},
				(error) => {
					geolocationError = 'Error occurred requesting device location';
					console.error(error);
				}
			);
		} else {
			geolocationError = 'This browser does not support geolocation';
			console.error('Geolocation is not supported by this browser');
		}
	}
</script>

<div class="flex flex-col gap-2 px-5">
	<div class="flex gap-2">
		sort by:
		<button
			on:click={() => goto('/')}
			class={`rounded-xl border border-gray-400 px-2 ${sortByActivity ? 'bg-black text-white' : 'bg-white'}`}
		>
			Activity
		</button>
		<button
			on:click={requestGeolocation}
			class={`rounded-xl border border-gray-400 px-2 ${sortByActivity ? 'bg-white' : 'bg-black text-white'}`}
		>
			Distance
		</button>
	</div>
	{#if geolocationError}
		<p class="text-sm text-rose-500">{geolocationError}</p>
	{/if}
</div>
