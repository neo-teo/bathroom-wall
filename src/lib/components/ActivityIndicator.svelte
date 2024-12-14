<script lang="ts">
	import ActivitySquares from './ActivitySquares.svelte';

	export let value: number;
	export let maxValue: number;

	function getSquareCount(value: number, maxValue: number) {
		if (value < (1 / 4) * maxValue) return 1;
		if (value < (2 / 4) * maxValue) return 2;
		if (value < (3 / 4) * maxValue) return 3;
		return 4; // for value >= maxValue
	}
</script>

<ActivitySquares count={getSquareCount(value, maxValue)} />
