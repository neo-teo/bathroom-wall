<script lang="ts">
	import type { PageData } from './$types';

	import { createSearchStore, searchHandler } from '$lib/stores/search';
	import { onDestroy } from 'svelte';
	import GooglePlaceAutoComplete from '$lib/components/GooglePlaceAutoComplete.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import type { Bar } from '@prisma/client';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const searchableBars = data.bars.map((bar) => ({
		...bar,
		searchTerms: `${bar.name} ${bar.address}`
	}));

	const searchStore = createSearchStore(searchableBars);

	const unsubscribe = searchStore.subscribe((model) => searchHandler(model));

	onDestroy(() => unsubscribe());

	let adding = false;

	let showModal = false;

	let googleInputBar: Bar;

	async function barSelected(data: CustomEvent<any>) {
		if (data && data.detail && data.detail.place) {
			const placeId: string = data.detail.place.place_id;

			const response = await fetch('/api/loadBar', {
				method: 'POST',
				body: JSON.stringify({ placeId }),
				headers: {
					'content-type': 'application/json'
				}
			});

			const parsed = await response.json();

			// TODO: maybe this logic could go into the api call ??
			googleInputBar = parsed.barData ?? {
				id: undefined,
				name: data.detail.place.name,
				address: data.detail.place.formatted_address,
				googleId: data.detail.place.place_id
			};

			showModal = true;
		}
	}
</script>

<a href="/"><h1>bathroom <br /> wall</h1></a>
<p>
	a shared wall of text, video, photo, and voice memo for people at a particular bar on a particular
	night
</p>

<form class="flex flex-col">
	<input
		placeholder="search bars by name or address..."
		type="text"
		bind:value={$searchStore.search}
	/>
</form>

<div class="flex flex-col gap-[20px] border border-gray-500 bg-white p-2">
	{#if $searchStore.filtered.length === 0}
		<!-- if there aren't any items, let the user know they can add one -->
		<div class="flex flex-wrap gap-[5px]">
			<p class="whitespace-nowrap">Don't see the bar you're looking for? Try</p>
			<button class="text-blue-400" on:click={() => (adding = true)}>adding</button>
			<p class="whitespace-nowrap">a spot.</p>
		</div>
	{:else}
		<!-- only render first 5 filtered bars -->
		{#each $searchStore.filtered
			.sort((a, b) => b.posts.length - a.posts.length)
			.slice(0, 20) as bar}
			<div class="flex flex-col gap-[5px]">
				<div class="flex items-center justify-between">
					<a href={`/bar/${bar.id}`}>
						<h2>{bar.name}</h2>
					</a>
					<p class="text-sm text-gray-400 no-underline">{bar.posts.length} tags</p>
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
	<form action={`?/createBar`} method="POST" class="flex flex-col gap-[10px]">
		<GooglePlaceAutoComplete on:place_changed={(data) => barSelected(data)} />

		{#if showModal}
			<Modal bind:showModal>
				<div class="flex flex-col gap-[20px]">
					{#if googleInputBar.id}
						<h1>This bar is already on bathroom wall</h1>
					{:else}
						<h1>Does this look like the right spot?</h1>
					{/if}

					<div class="flex flex-col gap-[5px]">
						<h2>{googleInputBar.name}</h2>
						<p class="text-sm">{googleInputBar.address}</p>
					</div>

					{#if googleInputBar.id}
						<button
							class="flex text-blue-400"
							on:click|preventDefault={() => goto(`/bar/${googleInputBar.id}`)}
						>
							go to bar's wall
						</button>
					{:else}
						<div class="flex gap-[20px]">
							<button class="flex text-blue-400"> yes </button>

							<button
								class="flex text-blue-400"
								on:click|preventDefault={() => (showModal = false)}
							>
								no
							</button>
						</div>
					{/if}
				</div>
			</Modal>
		{/if}
	</form>
{/if}
