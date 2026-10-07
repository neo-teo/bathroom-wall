<script context="module" lang="ts">
	// Everything a row needs, already normalized, whether it's a bar on the wall or a Google result.
	export type BarRowData = {
		key: string;
		name: string;
		street: string;
		city: string;
		postcode: string;
		country: string;
		distance: string; // already formatted, '' when unknown
		activity: number | null; // post count, or null for places not on the wall
		href?: string; // renders a link when set, otherwise a button that dispatches `select`
		sticker?: string; // sticker slapped across the row, e.g. for places not on the wall yet
		armed?: boolean; // waiting for a second tap to confirm
	};
</script>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ActivityIndicator from './ActivityIndicator.svelte';
	import Sticker from './Sticker.svelte';

	export let row: BarRowData;
	export let maxActivity = 0;

	const dispatch = createEventDispatcher<{ select: BarRowData }>();

	// A slightly different tilt per row so the stickers look hand-placed.
	const seed = [...row.key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
	const tilt = ((seed % 7) - 3) * 0.75; // -2.25deg..2.25deg
</script>

<svelte:element
	this={row.href ? 'a' : 'button'}
	href={row.href}
	type={row.href ? undefined : 'button'}
	class="group relative col-span-full grid grid-cols-subgrid items-center overflow-hidden border-b text-left last:border-b-0 no-underline hover:bg-black hover:text-white focus:outline-none"
	on:click={() => !row.href && dispatch('select', row)}
	role={row.href ? undefined : 'button'}
>
	<h3 class="truncate py-2.5 pl-2 text-base font-normal">{row.name}</h3>

	<p class="truncate opacity-50">{row.street}</p>

	<p class="hidden truncate opacity-50 sm:block">{row.city}</p>
	<p class="hidden whitespace-nowrap opacity-50 lg:block">{row.postcode}</p>
	<p class="hidden whitespace-nowrap opacity-50 md:block">{row.country}</p>
	<p class="whitespace-nowrap text-right">{row.distance}</p>

	{#if row.sticker}
		<!-- Positioned against the whole row (not a grid cell), centered, and allowed to overlap whatever's under it. -->
		<span
			class="pointer-events-none absolute inset-0 flex items-center justify-center whitespace-nowrap"
		>
			<Sticker size="sm" tilt={row.armed ? -tilt - 2 : tilt}>{row.sticker}</Sticker>
		</span>
	{/if}

	{#if row.activity === null}
		<div class="mr-2 h-8 w-8"></div>
	{:else}
		<ActivityIndicator value={row.activity} maxValue={maxActivity} />
	{/if}
</svelte:element>
