<script lang="ts">
	import GreenTileRow from '../GreenTileRow.svelte';

	export let barName: string | undefined = undefined;
</script>

<GreenTileRow />
<GreenTileRow />

<div class="grid h-10 grid-cols-[33.33%_auto]">
	<div class="flex bg-black">
		<a class="h-full flex items-center text-center bg-gray-900 px-1 text-xl font-black text-white no-underline" href="/">bath</a>
		<a class="h-full flex items-center bg-white px-1 text-xl font-black no-underline" href="/"
			>wall</a
		>
		<a class="h-full flex items-center bg-gray-900 px-1 text-xl font-black text-white no-underline" href="/">.co</a>
	</div>

	{#if barName}
		<div class="flex items-center justify-end px-2 font-bold">
			<div class="truncate">
				{barName}
			</div>
		</div>
	{:else}
		<div class="flex items-center justify-end px-2 py-1 text-right text-xs italic font-medium">
			leave your mark on the bathroom wall 🤙
		</div>
	{/if}
</div>

<GreenTileRow />
<GreenTileRow />
