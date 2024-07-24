<script lang="ts">
	import type { ActionData, PageData } from './$types';

	import type { Post } from '$lib/database.types';
	import Tile from '$lib/components/Tile.svelte';
	import Header from '$lib/components/header/Header.svelte';

	export let data: PageData;
	export let form: ActionData;

	$: posts = data.bar.posts;
	$: numRows = +data.numRows;
	$: numCols = +data.numCols;

	function getPost(row: number, col: number): Post | undefined {
		return posts.find((p) => p.row === row && p.col === col);
	}
</script>

<Header barName={data.bar.name} />

<div class={`grid w-full grid-cols-4 grid-rows-8 self-center`}>
	{#each Array(numRows) as _, row}
		{#each Array(numCols) as _, col}
			<Tile {row} {col} post={getPost(row, col)} {data} {form} />
		{/each}
	{/each}
</div>
