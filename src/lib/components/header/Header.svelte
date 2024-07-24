<script lang="ts">
	import WhiteTileRow from './WhiteTileRow.svelte';

	export let barName: string | undefined = undefined;
</script>

<WhiteTileRow />
<WhiteTileRow />

<div class="grid grid-cols-2 border-black">
	<div class="flex items-center bg-black">
		<a class="bg-gray-900 px-2 py-1 pl-3 text-2xl font-black text-white no-underline" href="/"
			>bath</a
		>
		<a class="flex h-full items-center bg-white px-2 py-1 text-2xl font-black no-underline" href="/"
			>wall</a
		>
		<a class="bg-gray-900 px-2 py-1 pr-2 text-2xl font-black text-white no-underline" href="/"
			>.co</a
		>
	</div>

	{#if barName}
		<div class="flex items-center justify-end px-2 pr-2 font-bold">
			<h2>{barName}</h2>
		</div>
	{:else}
		<div class="flex items-center px-2 pr-1 text-right text-sm">
			(leave your mark on the bathroom wall)
		</div>
	{/if}
</div>

<WhiteTileRow />
<WhiteTileRow />
