<script lang="ts">
	// A label slapped on at a slight angle. It flips colors when its nearest `group` parent is hovered,
	// so it stays readable on rows and tiles that invert on hover.
	export let tilt = 0; // degrees; ignored when wrapping (tilt the container instead, inline text can't rotate)
	export let wrap = false; // multi-line text, each line on its own strip
	export let tone: 'dark' | 'light' = 'dark'; // black sticker with white text, or the reverse
	// lg for the wall, sm for small labels like search rows, responsive for wall tiles (sm on phones, lg from md up)
	export let size: 'sm' | 'lg' | 'responsive' = 'lg';

	const textSizes = {
		sm: 'text-sm sm:text-base',
		lg: 'text-xl',
		responsive: 'text-sm sm:text-base md:text-xl'
	};
	$: textSize = textSizes[size];

	// Both tones flip on hover, since whatever is behind them flips too.
	$: colors =
		tone === 'dark'
			? 'bg-black text-white group-hover:bg-white group-hover:text-black'
			: 'bg-white text-black group-hover:bg-black group-hover:text-white';
</script>

{#if wrap}
	<span
		class="whitespace-pre-wrap break-words px-1.5 [box-decoration-break:clone] {textSize} {colors} {$$props.class ??
			''}"
	>
		<slot />
	</span>
{:else}
	<span
		class="inline-block max-w-full truncate whitespace-nowrap px-1.5 {textSize} {colors} {$$props.class ??
			''}"
		style="transform: rotate({tilt}deg);"
	>
		<slot />
	</span>
{/if}
