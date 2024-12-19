<script lang="ts">
	import { PUBLIC_GOOGLE_PLACES_API_KEY } from '$env/static/public';
	import { createEventDispatcher, onMount } from 'svelte';
	import { loadGooglePlacesLibrary } from './loader';

	let options: google.maps.places.AutocompleteOptions = { types: ['bar', 'night_club', 'cafe'] };
	let placeholder: string = "Don't see what you're looking for? Be the one to add it...";

	let shortName = '';
	let longName = '';
	let id = 'google place autocomplete input field';
	let placeId = '';
	let address = '';
	let location = ''; // e.g. New York, Brooklyn, Thessaloniki, Athina -- used for url creation
	let lat = '';
	let lng = '';

	type PlaceEvent = {
		place: google.maps.places.PlaceResult;
		text: string;
	} | null;

	const dispatch = createEventDispatcher();

	let inputField: HTMLInputElement;

	onMount(() => {
		loadGooglePlacesLibrary(PUBLIC_GOOGLE_PLACES_API_KEY, () => {
			const autocomplete = new google.maps.places.Autocomplete(inputField, options);

			autocomplete.addListener('place_changed', () => {
				const place = autocomplete.getPlace();
				// There are circumstances where the place_changed event fires, but we
				// were NOT given location data. I only want to propagate the event if we
				// truly received location data from Google.
				// See the `Type something, no suggestions, hit Enter` test case.
				if (hasLocationData(place)) {
					setSelectedLocation({
						place: place,
						text: inputField.value
					});
				}
			});

			dispatch('ready');
		});
	});

	function emptyLocationField() {
		inputField.value = '';
		onChange();
	}

	function hasLocationData(place: google.maps.places.PlaceResult) {
		const fieldsToLookFor = (options && options?.fields) || ['geometry'];
		return place.hasOwnProperty(fieldsToLookFor[0]);
	}

	function onChange() {
		if (inputField.value === '') {
			setSelectedLocation(null);
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		const suggestionsAreVisible = document.getElementsByClassName('pac-item').length;

		if (event.key === 'Enter' || event.key === 'Tab') {
			if (suggestionsAreVisible) {
				const isSuggestionSelected = document.getElementsByClassName('pac-item-selected').length;
				if (!isSuggestionSelected) {
					selectFirstSuggestion();
				}
			} else if (doesNotMatchSelectedLocation(inputField.value)) {
				setTimeout(emptyLocationField, 10);
			}
		} else if (event.key === 'Escape') {
			setTimeout(emptyLocationField, 10);
		}

		if (suggestionsAreVisible) {
			if (event.key === 'Enter') {
				/* When suggestions are visible, don't let an 'Enter' submit a form (since
				 * the user is interacting with the list of suggestions at the time, not
				 * expecting their actions to affect the form as a whole). */
				event.preventDefault();
			}
		}
	}

	function selectFirstSuggestion() {
		// Simulate the 'down arrow' key in order to select the first suggestion:
		// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
		const simulatedEvent = new KeyboardEvent('keydown', {
			key: 'ArrowDown',
			code: 'ArrowDown',
			keyCode: 40
		});
		inputField.dispatchEvent(simulatedEvent);
	}

	function setSelectedLocation(data: PlaceEvent) {
		longName = (data && data.text) || '';
		shortName = (data && data.place.name) || '';
		placeId = (data && data.place.place_id) || '';
		address = (data && data.place.formatted_address) || '';
		lat = (data && data.place.geometry?.location.lat().toString()) || '';
		lng = (data && data.place.geometry?.location.lng().toString()) || '';

		if (data && data.place.address_components) {
			const priorityTypes = [
				'locality',
				'sublocality_level_1',
				'administrative_area_level_1',
				'country'
			];
			let foundComponent = undefined;

			for (const type of priorityTypes) {
				foundComponent = data.place.address_components.find((component) =>
					component.types.includes(type)
				);
				if (foundComponent) {
					location = foundComponent.short_name;
					break; // Stop searching once a match is found.
				}
			}
		}

		dispatch('place_changed', data);
	}

	function doesNotMatchSelectedLocation(value: string) {
		return longName !== value;
	}
</script>

<input
	{id}
	bind:this={inputField}
	on:change={onChange}
	on:keydown={onKeyDown}
	{placeholder}
	class="w-screen border-none focus:outline-none"
	name={'longName'}
	value={longName}
/>
<input hidden name="shortName" value={shortName} />
<input hidden name="address" value={address} />
<input hidden name="googlePlaceId" value={placeId} />
<input hidden name="location" value={location} />
<input hidden name="lat" value={lat} />
<input hidden name="lng" value={lng} />
