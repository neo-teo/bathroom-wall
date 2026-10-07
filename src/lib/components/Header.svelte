<script lang="ts">
	import TileSeparator from './TileSeparator.svelte';
	import Sticker from './Sticker.svelte';

	import { onDestroy } from 'svelte';

	export let barName: string | undefined = undefined;

	// Tapping the "?" types out the tagline one letter at a time, holds it, then erases it back to "?".
	const tagline = 'a guest book for cafes and bars';
	const typeMs = 45;
	const eraseMs = 25;
	const holdMs = 2500;

	let shown = 0; // how many letters of the tagline are visible
	let timer: ReturnType<typeof setTimeout> | undefined;

	function play() {
		if (timer) return; // already animating

		const type = () => {
			if (shown < tagline.length) {
				shown += 1;
				timer = setTimeout(type, typeMs);
			} else {
				timer = setTimeout(erase, holdMs);
			}
		};

		const erase = () => {
			if (shown > 0) {
				shown -= 1;
				timer = setTimeout(erase, eraseMs);
			} else {
				timer = undefined;
			}
		};

		type();
	}

	onDestroy(() => clearTimeout(timer));
</script>

<TileSeparator />

<div class="grid h-10 grid-cols-[140px_auto]">
	<div class="logo group flex text-xl font-bold">
		<a class="bg-black text-white group-hover:bg-white group-hover:text-black" href="/">
			<span>bath</span>
		</a>
		<a class="bg-white text-black group-hover:bg-black group-hover:text-white" href="/">
			<span>wall</span>
		</a>
		<!-- border-r keeps the logo's edge visible when hover turns this tile white -->
		<a class="border-r bg-black text-white group-hover:bg-white group-hover:text-black" href="/">
			<span>.co</span>
		</a>
	</div>

	<!-- On a bar page its name is stuck on next to the logo; the tagline "?" sits on the right on every page. -->
	<div class="flex min-w-0 items-center justify-between gap-4 pr-2" class:pl-10={barName}>
		{#if barName}
			<h1 class="min-w-0 font-normal">
				<Sticker size="sm">{barName}</Sticker>
			</h1>
		{/if}

		<button
			class="ml-auto shrink-0 focus:outline-none"
			class:cursor-default={shown > 0}
			aria-label={tagline}
			on:click={play}
		>
			{#if shown === 0}
				<span class="text-xl">?</span>
			{:else}
				{tagline.slice(0, shown)}
			{/if}
		</button>
	</div>
</div>

<TileSeparator />

<style lang="postcss">
	.logo > a {
		display: flex;
		align-items: center;
		text-decoration: none;
		padding-left: 5px;
		padding-right: 5px;
	}
</style>
