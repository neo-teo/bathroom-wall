<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import type { Post } from '$lib/database.types';
	import Tile from '$lib/components/Tile.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: posts = data.bar.posts;
	$: numRows = +data.numRows;
	$: numCols = +data.numCols;

	function getPost(row: number, col: number): Post | undefined {
		return posts.find((p) => p.row === row && p.col === col);
	}
</script>

<div class="mx-5 flex justify-between">
	<a href="/"><h1>bathroom <br /> wall</h1></a>
	<div class="flex flex-col items-end justify-center text-right">
		<h2>{data.bar.name}</h2>
	</div>
</div>

<div class="rounded-3 bg-pad grid grid-cols-5 grid-rows-8 self-center bg-red-800">
	{#each Array(numRows) as _, row}
		{#each Array(numCols) as _, col}
			<Tile {row} {col} post={getPost(row, col)} {data} {form} />
		{/each}
	{/each}
</div>
