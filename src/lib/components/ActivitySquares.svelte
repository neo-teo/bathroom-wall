<script>
	export let count;

	function getRandomColor() {
		const colors = ['red', 'blue', 'green', 'orange', 'purple', 'magenta'];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function getRandomLetter() {
		const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
		return letters[Math.floor(Math.random() * letters.length)];
	}
</script>

<div class="mr-2 flex h-8 w-8 items-center justify-center">
	<div class="grid grid-cols-2 gap-1">
		{#each Array(count) as _, index}
			<div
				class="square text-xs font-bold text-white"
				class:col-span-2={count % 2 === 1 && index === count - 1}
				style="
            background-color: {getRandomColor()}; 
            transform: rotate({Math.random() * 45 - 22.5}deg)
            "
			>
				{getRandomLetter()}
			</div>
		{/each}
	</div>
</div>

<style>
	.square {
		width: 12px;
		height: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
