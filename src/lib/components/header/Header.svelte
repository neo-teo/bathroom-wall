<script lang="ts">
	import WhiteTileRow from './WhiteTileRow.svelte';

	export let barName: string | undefined = undefined;
</script>

<WhiteTileRow />
<WhiteTileRow />

<div class="grid h-10 grid-cols-[41.6%_auto] border-black">
	<div class="flex items-center bg-black">
		<a class="bg-gray-900 px-2 py-1 text-xl font-black text-white no-underline" href="/">bath</a>
		<a class="flex h-full items-center bg-white px-2 py-1 text-xl font-black no-underline" href="/"
			>wall</a
		>
		<a class="bg-gray-900 px-2 py-1 text-xl font-black text-white no-underline" href="/">.co</a>
	</div>

	{#if barName}
		<div class="flex items-center justify-end px-2 font-bold">
			<div class="truncate">
				{barName}
			</div>
		</div>
	{:else}
		<div class="flex rotate-0 items-end justify-end px-2 py-1 text-right text-xs font-medium">
			leave your mark <br /> on the bathroom wall🤙
		</div>
	{/if}
</div>

<WhiteTileRow />
<WhiteTileRow />
