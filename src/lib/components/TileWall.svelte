<script lang="ts">
	import type { Post } from '$lib/database.types';
	import Tile from './Tile.svelte';

	export let data: any;
	export let form: any;
	export let posts: Post[] = [];

	let rows: number = 8;
	let cols: number = 5;
</script>
