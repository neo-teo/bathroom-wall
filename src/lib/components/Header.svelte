<script lang="ts">
	import TileSeparator from './TileSeparator.svelte';

	export let barName: string | undefined = undefined;
</script>

<TileSeparator />

<div class="grid h-10 grid-cols-[140px_auto]">
	<div class="logo flex bg-gray-800 text-xl font-bold">
		<a class="text-white" href="/">bath</a>
		<a class="bg-white text-black" href="/">wall</a>
		<a class="text-white" href="/">.co</a>
	</div>

	<div class="flex items-center justify-end px-2">
		{#if !barName}
			a guest book for cafes and bars
		{:else}
			{barName}
		{/if}
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
